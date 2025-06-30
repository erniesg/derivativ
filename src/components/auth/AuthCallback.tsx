import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useUser } from '../../contexts/UserContext'
import { useAssessment } from '../../contexts/AssessmentContext'
import { useRole } from '../../contexts/RoleContext'
import { AuthService } from '../../services/auth'

export function AuthCallback() {
  const navigate = useNavigate()
  const { user: authUser, loading } = useAuth()
  const { setUser } = useUser()
  const { setAssessmentData } = useAssessment()
  const { selectedRole } = useRole()
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    if (!loading && authUser) {
      loadUserProfileData()
    } else if (!loading && !authUser) {
      navigate('/', { replace: true })
    }
  }, [authUser, loading, navigate])

  const loadUserProfileData = async () => {

    console.log('AuthCallback')

    if (!authUser) return

    setProfileLoading(true)

    try {
      // Check if there's pending form data from the landing page
      const pendingFormData = sessionStorage.getItem('pendingFormData')
      const redirectTo = sessionStorage.getItem('authRedirectTo') || '/dashboard'

      // Try to fetch existing backend profile first
      let backendProfile = await AuthService.fetchBackendProfile()

      // If no profile exists in backend, create one
      if (!backendProfile) {
        console.log('No backend profile found, creating new profile')

        // Determine default role and school from selectedRole, pending form data, or defaults
        let defaultRole: 'student' | 'teacher' = selectedRole || 'student'
        let defaultSchool = ''

        if (pendingFormData) {
          try {
            const formData = JSON.parse(pendingFormData)
            defaultRole = formData.role || defaultRole
            defaultSchool = formData.school || ''
          } catch (error) {
            console.error('Error parsing pending form data:', error)
          }
        }

        // Create profile in backend using the globally selected role

        console.log('Creating profile with role:', defaultRole)
        backendProfile = await AuthService.createBackendProfile({
          role: defaultRole,
          school: "null"
        })
      }

      // Load complete user profile (this will now find the created profile)
      const { user: profileUser, assessmentData: profileAssessmentData } = await AuthService.loadUserProfile(selectedRole || undefined)

      let finalUserData = profileUser
      let finalAssessmentData = profileAssessmentData

      // Fallback if profile loading still fails
      if (!profileUser) {
        console.log('Profile loading failed, using default data')
        const defaultData = AuthService.createDefaultUserData(authUser)
        finalUserData = defaultData.user
        finalAssessmentData = defaultData.assessmentData

        // Merge with any pending form data from landing page
        if (pendingFormData) {
          try {
            const formData = JSON.parse(pendingFormData)
            finalUserData = { ...finalUserData, ...formData }
          } catch (error) {
            console.error('Error parsing pending form data:', error)
          }
        }
      }

      // Set the user and assessment data
      setUser(finalUserData)
      setAssessmentData(finalAssessmentData)

      // Clean up session storage
      sessionStorage.removeItem('pendingFormData')
      sessionStorage.removeItem('authRedirectTo')

      // Navigate to the intended destination
      navigate(redirectTo, { replace: true })

    } catch (error) {
      console.error('Error loading user profile:', error)

      // Fallback to default data if API fails
      const defaultData = AuthService.createDefaultUserData(authUser)
      setUser(defaultData.user)
      setAssessmentData(defaultData.assessmentData)

      // Clean up and redirect
      sessionStorage.removeItem('pendingFormData')
      sessionStorage.removeItem('authRedirectTo')
      navigate('/dashboard', { replace: true })
    } finally {
      setProfileLoading(false)
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {loading ? 'Completing sign in...' : 'Loading your profile...'}
          </p>
        </div>
      </div>
    )
  }

  return null
}
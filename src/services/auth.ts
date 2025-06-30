import { supabase } from '../config/supabase'
import { AuthProvider, AppUser } from '../types/auth'
import { apiService } from './api'

interface BackendProfile {
  id: string;
  role: 'student' | 'teacher';
  last_login: string | null;
  created_at: string;
  is_active: boolean;
  email: string;
}

export class AuthService {
  static async signInWithProvider(provider: AuthProvider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      throw error
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Create profile via backend API
  static async createBackendProfile(profileData: { school: 'null'; role: 'student' | 'teacher' }): Promise<BackendProfile | null> {
    try {
      const session = await this.getSession()
      if (!session?.access_token) {
        console.warn('No session token available for profile creation')
        return null
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        console.warn(`Profile creation API error: ${response.status} ${response.statusText}`)
        return null
      }

      const result = await response.json()
      console.log('Backend profile created:', result)
      return result.data
    } catch (error) {
      // Handle connection errors gracefully (backend not running)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Backend API not available - connection refused')
      } else {
        console.error('Error creating backend profile:', error)
      }
      return null
    }
  }

  // Fetch profile data from backend API
  static async fetchBackendProfile(): Promise<BackendProfile | null> {
    try {
      const session = await this.getSession()
      if (!session?.access_token) {
        console.warn('No session token available for profile fetch')
        return null
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.warn(`Profile API error: ${response.status} ${response.statusText}`)
        return null
      }

      const profileData = await response.json()
      console.log('Backend profile data received:', profileData)
      return profileData.data
    } catch (error) {
      // Handle connection errors gracefully (backend not running)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('Backend API not available - connection refused')
      } else {
        console.error('Error fetching backend profile:', error)
      }
      return null
    }
  }

  static async getCurrentUser(): Promise<AppUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        // Don't log auth errors for teacher pages - they're expected when not authenticated
        if (window.location.pathname.includes('/teacher')) {
          return null
        }
        throw error
      }
      if (!user) return null

      // Fetch backend profile to get the correct role and other data
      const backendProfile = await this.fetchBackendProfile()
      
      return this.transformSupabaseUser(user, backendProfile)
    } catch (error) {
      // Only log errors if not on teacher pages
      if (!window.location.pathname.includes('/teacher')) {
        console.error('Error getting current user:', error)
      }
      return null
    }
  }

  static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  // Load complete user profile from your backend API
  static async loadUserProfile(): Promise<{ user: AppUser | null, assessmentData: any | null }> {
    try {
      const session = await this.getSession()
      if (!session?.access_token) {
        return { user: null, assessmentData: null }
      }

      // Get Supabase user data first
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
      if (error || !supabaseUser) {
        console.error('Failed to get Supabase user:', error)
        return { user: null, assessmentData: null }
      }

      // Try to fetch backend profile data
      let backendProfile = await this.fetchBackendProfile()
      
      // If no profile exists, try to create one with default values
      if (!backendProfile) {
        console.log('No backend profile found, attempting to create one')
        
        // Try to create a default profile
        backendProfile = await this.createBackendProfile({
          role: 'student', // Default to student
          school: "null"
        })
        
        // If backend is unavailable, create a fallback user with default role
        if (!backendProfile) {
          console.warn('Backend unavailable, using fallback user data')
          const fallbackUser = this.transformSupabaseUser(supabaseUser, null)
          
          // Create default assessment data for students
          const defaultData = this.createDefaultUserData(supabaseUser)
          
          return {
            user: fallbackUser,
            assessmentData: fallbackUser.role === 'student' ? defaultData.assessmentData : null
          }
        }
      }

      // Combine Supabase user with backend profile
      const enhancedUser = this.transformSupabaseUser(supabaseUser, backendProfile)

      // Load analytics data from real API (only for students)
      let assessmentData = null
      if (backendProfile.role === 'student') {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/quiz/analytics`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          })

          if (!response.ok) {
            throw new Error(`Analytics API error: ${response.status}`)
          }

          const analyticsResponse = await response.json()
          console.log('Analytics data received:', analyticsResponse)
          assessmentData = analyticsResponse.data

        } catch (apiError) {
          console.warn('Failed to load analytics from API, using default for new user:', apiError)
          // Use default assessment data when API is unavailable
          const defaultData = this.createDefaultUserData(supabaseUser)
          assessmentData = defaultData.assessmentData
        }
      }

      return {
        user: enhancedUser,
        assessmentData: assessmentData
      }

    } catch (error) {
      console.error('Error loading user profile:', error)
      
      // Return fallback data even on complete failure
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (supabaseUser) {
          const fallbackUser = this.transformSupabaseUser(supabaseUser, null)
          const defaultData = this.createDefaultUserData(supabaseUser)
          
          return {
            user: fallbackUser,
            assessmentData: fallbackUser.role === 'student' ? defaultData.assessmentData : null
          }
        }
      } catch (fallbackError) {
        console.error('Fallback user creation failed:', fallbackError)
      }
      
      return { user: null, assessmentData: null }
    }
  }

  // Helper method to determine difficulty from score
  static getDifficultyFromScore(score: number): 'easy' | 'medium' | 'hard' {
    if (score >= 8) return 'easy'
    if (score >= 6) return 'medium'
    return 'hard'
  }

  // Create default data if profile doesn't exist yet
  static createDefaultUserData(authUser: any): { user: AppUser, assessmentData: any } {
    console.log('createDefaultUserData')
    console.log('authUser:', authUser)
    const userData = {
      id: authUser.id,
      name: authUser.name || authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      role: 'student' as const,
      avatar_url: authUser.avatar_url,
      provider: authUser.provider,
      examSession: 'May/June 2025',
      school: 'Your School',
      subjects: ['Mathematics'],
      targetGrade: 'A*',
      studyHoursPerWeek: 8,
      created_at: authUser.created_at,
      updated_at: authUser.updated_at
    }

    // Default assessment data for new iGCSE Math students
    const assessmentData = {
      averageScore: 0,
      totalQuizzes: 0,
      recentQuizzes: [],
      strongestTopics: [],
      weakestTopics: [],
      topicsPerformance: [
        { topicName: 'Number', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' },
        { topicName: 'Algebra', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' },
        { topicName: 'Geometry', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' },
        { topicName: 'Coordinate Geometry', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' },
        { topicName: 'Trigonometry', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' },
        { topicName: 'Statistics', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' },
        { topicName: 'Probability', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' },
        { topicName: 'Functions', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' },
        { topicName: 'Sequences and Series', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' },
        { topicName: 'Mensuration', currentGrade: 0, wmaGrade: 0, totalAttempts: 0, trend: 'stable' }
      ]
    }

    return { user: userData, assessmentData }
  }

  static transformSupabaseUser(user: any, backendProfile?: BackendProfile | null): AppUser {
    const metadata = user.user_metadata || {}
    const appMetadata = user.app_metadata || {}
    
    return {
      id: user.id,
      email: user.email || '',
      name: (metadata.full_name as string) || (metadata.name as string) || (metadata.user_name as string) || user.email?.split('@')[0] || 'User',
      role: backendProfile?.role || 'student',
      avatar_url: (metadata.avatar_url as string) || (metadata.picture as string),
      provider: appMetadata.provider as 'discord' | 'github' | 'twitter' | undefined,
      created_at: backendProfile?.created_at || user.created_at || new Date().toISOString(),
      updated_at: user.updated_at || new Date().toISOString(),
      last_login: backendProfile?.last_login,
      is_active: backendProfile?.is_active
    }
  }

  static onAuthStateChange(callback: (user: AppUser | null, session: object | null) => void) {
    return supabase.auth.onAuthStateChange((_event: any, session: any) => {
      // Don't fetch backend profile here to avoid endless loading
      // Backend profile will be fetched when needed (getCurrentUser, loadUserProfile)
      const user = session?.user ? this.transformSupabaseUser(session.user) : null
      callback(user, session)
    })
  }
}
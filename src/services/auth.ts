import { supabase } from '../config/supabase'
import { AuthProvider, AppUser } from '../types/auth'
import { apiService } from './api'

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

      return this.transformSupabaseUser(user)
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

      // Call your profile endpoint
      const profileResponse = await apiService.getUserProfile(session.access_token)
      
      if (!profileResponse.success) {
        console.warn('Failed to load user profile:', profileResponse.error)
        // Fall back to basic Supabase user if profile API fails
        const basicUser = await this.getCurrentUser()
        return { user: basicUser, assessmentData: null }
      }

      // Call assessment data endpoint
      const assessmentResponse = await apiService.getUserAssessmentData(session.access_token)
      
      return {
        user: profileResponse.data,
        assessmentData: assessmentResponse.success ? assessmentResponse.data : null
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
      return { user: null, assessmentData: null }
    }
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
      school: '',
      subjects: ['Mathematics'],
      created_at: authUser.created_at,
      updated_at: authUser.updated_at
    }

    const assessmentData = {
      userId: authUser.id,
      topicScores: [
        { topic: 'Algebra', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Geometry', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Trigonometry', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Statistics', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Number Theory', score: 5, attempts: 0, recentPerformance: [], difficulty: 'medium' as const }
      ],
      overallLevel: 5,
      recommendedTopics: ['Algebra', 'Geometry'],
      lastAssessment: new Date()
    }

    return { user: userData, assessmentData }
  }

  static transformSupabaseUser(user: any): AppUser {
    const metadata = user.user_metadata || {}
    const appMetadata = user.app_metadata || {}
    
    return {
      id: user.id,
      email: user.email || '',
      name: (metadata.full_name as string) || (metadata.name as string) || (metadata.user_name as string) || user.email?.split('@')[0] || 'User',
      role: (appMetadata.role as 'student' | 'teacher') || 'teacher',
      avatar_url: (metadata.avatar_url as string) || (metadata.picture as string),
      provider: appMetadata.provider as 'discord' | 'github' | 'twitter' | undefined,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: user.updated_at || new Date().toISOString()
    }
  }

  static onAuthStateChange(callback: (user: AppUser | null, session: object | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ? this.transformSupabaseUser(session.user) : null
      callback(user, session)
    })
  }
}
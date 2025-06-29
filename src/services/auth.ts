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
      
      if (error) throw error
      if (!user) return null

      return this.transformSupabaseUser(user)
    } catch (error) {
      console.error('Error getting current user:', error)
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

      // TODO: Replace with real API calls when ready
      // For now, return mock data for iGCSE Math
      console.log('Using mock data until API is ready...')
      
      const basicUser = await this.getCurrentUser()
      if (!basicUser) return { user: null, assessmentData: null }
      
      // Mock user profile data for iGCSE Math
      const mockUserProfile = {
        ...basicUser,
        examSession: 'May/June 2025',
        school: 'International Academy',
        subjects: ['Mathematics', 'Additional Mathematics'],
        targetGrade: 'A*',
        studyHoursPerWeek: 12
      }

      // Mock assessment data with realistic iGCSE Math performance
      const mockAssessmentData = {
        userId: basicUser.id,
        topicScores: [
          { topic: "Number", score: 8.2, attempts: 15, recentPerformance: [7.5, 8.0, 8.5, 8.2], difficulty: 'easy' as const },
          { topic: "Algebra", score: 6.8, attempts: 12, recentPerformance: [6.0, 6.5, 7.0, 6.8], difficulty: 'medium' as const },
          { topic: "Geometry", score: 7.5, attempts: 10, recentPerformance: [7.0, 7.2, 7.8, 7.5], difficulty: 'medium' as const },
          { topic: "Coordinate Geometry", score: 5.4, attempts: 8, recentPerformance: [4.8, 5.0, 5.8, 5.4], difficulty: 'hard' as const },
          { topic: "Trigonometry", score: 4.9, attempts: 6, recentPerformance: [4.5, 4.8, 5.2, 4.9], difficulty: 'hard' as const },
          { topic: "Statistics", score: 7.8, attempts: 11, recentPerformance: [7.2, 7.5, 8.0, 7.8], difficulty: 'medium' as const },
          { topic: "Probability", score: 6.2, attempts: 9, recentPerformance: [5.8, 6.0, 6.5, 6.2], difficulty: 'medium' as const },
          { topic: "Functions", score: 5.8, attempts: 7, recentPerformance: [5.2, 5.5, 6.0, 5.8], difficulty: 'hard' as const },
          { topic: "Sequences and Series", score: 6.5, attempts: 8, recentPerformance: [6.0, 6.2, 6.8, 6.5], difficulty: 'medium' as const },
          { topic: "Mensuration", score: 7.2, attempts: 10, recentPerformance: [6.8, 7.0, 7.5, 7.2], difficulty: 'medium' as const },
          { topic: "Graphs", score: 6.9, attempts: 9, recentPerformance: [6.5, 6.8, 7.2, 6.9], difficulty: 'medium' as const },
          { topic: "Transformations", score: 5.6, attempts: 6, recentPerformance: [5.0, 5.2, 6.0, 5.6], difficulty: 'hard' as const }
        ],
        overallLevel: 6.7,
        recommendedTopics: ['Trigonometry', 'Coordinate Geometry', 'Functions'],
        lastAssessment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        studyStreak: 7,
        totalStudyTime: 85, // hours
        examCountdown: 85, // days
        strongestAreas: ['Number', 'Statistics', 'Geometry'],
        weakestAreas: ['Trigonometry', 'Coordinate Geometry', 'Functions']
      }

      return {
        user: mockUserProfile,
        assessmentData: mockAssessmentData
      }

      /* TODO: Uncomment when APIs are ready
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
      */
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
      school: 'Your School',
      subjects: ['Mathematics'],
      targetGrade: 'A*',
      studyHoursPerWeek: 8,
      created_at: authUser.created_at,
      updated_at: authUser.updated_at
    }

    // Default assessment data for new iGCSE Math students
    const assessmentData = {
      userId: authUser.id,
      topicScores: [
        { topic: 'Number', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Algebra', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Geometry', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Coordinate Geometry', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Trigonometry', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Statistics', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Probability', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Functions', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Sequences and Series', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Mensuration', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Graphs', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const },
        { topic: 'Transformations', score: 5.0, attempts: 0, recentPerformance: [], difficulty: 'medium' as const }
      ],
      overallLevel: 5.0,
      recommendedTopics: ['Number', 'Algebra', 'Geometry'],
      lastAssessment: null,
      studyStreak: 0,
      totalStudyTime: 0,
      examCountdown: 180, // 6 months
      strongestAreas: [],
      weakestAreas: []
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
      role: (appMetadata.role as 'student' | 'teacher') || 'student',
      avatar_url: (metadata.avatar_url as string) || (metadata.picture as string),
      provider: appMetadata.provider as 'discord' | 'github' | 'twitter' | undefined,
      created_at: user.created_at || new Date().toISOString(),
      updated_at: user.updated_at || new Date().toISOString()
    }
  }

  static onAuthStateChange(callback: (user: AppUser | null, session: object | null) => void) {
    return supabase.auth.onAuthStateChange((_event: any, session: any) => {
      const user = session?.user ? this.transformSupabaseUser(session.user) : null
      callback(user, session)
    })
  }
}
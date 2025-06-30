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

      const basicUser = await this.getCurrentUser()
      if (!basicUser) return { user: null, assessmentData: null }

      // Load analytics data from real API
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

        const analyticsData = await response.json()
        console.log('Analytics data received:', analyticsData)

        // Calculate overall metrics
        // const validScores = transformedTopicScores.filter((t: any) => t.score > 0)
        // const averageScore = validScores.length > 0 
        //   ? validScores.reduce((sum: number, topic: any) => sum + topic.score, 0) / validScores.length
        //   : analyticsData.data.averageScore || 0

        // const strongestTopics = transformedTopicScores
        //   .filter((topic: any) => topic.score >= 7)
        //   .sort((a: any, b: any) => b.score - a.score)
        //   .slice(0, 3)
        //   .map((t: any) => t.topic)

        // const weakestTopics = transformedTopicScores
        //   .filter((topic: any) => topic.score > 0 && topic.score < 6)
        //   .sort((a: any, b: any) => a.score - b.score)
        //   .slice(0, 3)
        //   .map((t: any) => t.topic)

        // Enhanced user profile data


        // Real assessment data from API


        return {
          user: basicUser,
          assessmentData: analyticsData.data
        }

      } catch (apiError) {
        console.warn('Failed to load analytics from API, falling back to default data:', apiError)
        
        // Fallback to default data if API fails
        // const defaultData = this.createDefaultUserData(basicUser)
        // return {
        //   user: { ...basicUser, ...defaultData.user },
        //   assessmentData: defaultData.assessmentData
        // }
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
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
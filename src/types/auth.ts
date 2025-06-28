
export interface AppUser {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher'
  avatar_url?: string
  provider?: 'discord' | 'github' | 'twitter'
  created_at: string
  updated_at: string
  
  // Student-specific fields
  examSession?: string
  currentGrade?: number
  school?: string
  subjects?: string[]
  
  // Teacher-specific fields
  gradeLevels?: string[]
  schoolType?: string
}

export interface AuthState {
  user: AppUser | null
  session: object | null
  loading: boolean
  error: string | null
}

export type AuthProvider = 'discord' | 'github' | 'twitter'

export interface AuthContextType extends AuthState {
  signInWithProvider: (provider: AuthProvider) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}
import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthService } from '../services/auth'
import { AuthContextType, AuthState, AuthProvider, AppUser } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const session = await AuthService.getSession()
        const user = await AuthService.getCurrentUser()

        if (mounted) {
          setState({
            user,
            session,
            loading: false,
            error: null
          })
        }
      } catch (error) {
        if (mounted) {
          setState({
            user: null,
            session: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to initialize auth'
          })
        }
      }
    }

    getInitialSession()

    const { data: { subscription } } = AuthService.onAuthStateChange((user: AppUser | null, session: any) => {
      if (mounted) {
        setState({
          user,
          session,
          loading: false,
          error: null
        })
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signInWithProvider = async (provider: AuthProvider) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await AuthService.signInWithProvider(provider)
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : `Failed to sign in with ${provider}`
      }))
      throw error
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await AuthService.signOut()
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out'
      }))
      throw error
    }
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  const value: AuthContextType = {
    ...state,
    signInWithProvider,
    signOut,
    clearError
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
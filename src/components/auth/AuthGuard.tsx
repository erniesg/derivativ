import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { SocialLoginButtons } from './LoginButton'

interface AuthGuardProps {
  children: React.ReactNode
  title?: string
  description?: string
  fallbackComponent?: React.ReactNode
}

export function AuthGuard({
  children,
  title = "Sign in to continue",
  description = "Please sign in with one of the following providers to access this feature.",
  fallbackComponent
}: AuthGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-4 p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {description}
            </p>
          </div>

          <div>
            <SocialLoginButtons />
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <AuthGuard
        title="Authentication Required"
        description="You need to be signed in to access this page."
      >
        {children}
      </AuthGuard>
    )
  }

  return <>{children}</>
}
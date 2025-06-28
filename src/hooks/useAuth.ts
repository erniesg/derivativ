import { useAuth as useAuthContext } from '../contexts/AuthContext'

export const useAuth = useAuthContext

export function useRequireAuth() {
  const auth = useAuthContext()
  
  if (!auth.user && !auth.loading) {
    throw new Error('Authentication required')
  }
  
  return auth
}
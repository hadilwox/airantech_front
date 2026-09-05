import { useAuthStore } from '@/stores/auth'

export function usePermission() {
  const auth = useAuthStore()

  return {
    can: auth.can,
    hasRole: auth.hasRole,
  }
}

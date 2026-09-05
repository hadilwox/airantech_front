import type { Router } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

export function applyAuthGuard(router: Router): void {
  router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (auth.status === 'idle') {
      await auth.bootstrap()
    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { name: 'dashboard' }
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.permission && !auth.can(to.meta.permission)) {
      return { name: 'forbidden' }
    }

    return true
  })
}

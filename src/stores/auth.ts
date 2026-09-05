import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { authApi } from '@/api/auth'
import { ApiError } from '@/types/api'
import type {
  InstructorRegisterPayload,
  LoginPayload,
  StudentRegisterPayload,
  User,
} from '@/types/auth'

type Status = 'idle' | 'loading' | 'authenticated' | 'guest'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const status = ref<Status>('idle')

  const isAuthenticated = computed(() => status.value === 'authenticated')
  const roles = computed(() => user.value?.roles ?? [])
  const permissions = computed(() => user.value?.permissions ?? [])

  function can(permission: string): boolean {
    return permissions.value.includes(permission)
  }

  function hasRole(role: string): boolean {
    return roles.value.includes(role)
  }

  /** Restores session state after a page refresh. Never throws — 401 just means guest. */
  async function bootstrap(): Promise<void> {
    if (status.value !== 'idle') {
      return
    }

    status.value = 'loading'

    try {
      user.value = await authApi.me()
      status.value = 'authenticated'
    } catch {
      user.value = null
      status.value = 'guest'
    }
  }

  async function login(payload: LoginPayload): Promise<void> {
    user.value = await authApi.login(payload)
    status.value = 'authenticated'
  }

  async function registerStudent(payload: StudentRegisterPayload): Promise<void> {
    user.value = await authApi.registerStudent(payload)
    status.value = 'authenticated'
  }

  async function registerInstructor(payload: InstructorRegisterPayload): Promise<void> {
    user.value = await authApi.registerInstructor(payload)
    status.value = 'authenticated'
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout()
    } catch (error) {
      // A 401 here just means the session already expired — treat as logged out either way.
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error
      }
    } finally {
      user.value = null
      status.value = 'guest'
    }
  }

  return {
    user,
    status,
    isAuthenticated,
    roles,
    permissions,
    can,
    hasRole,
    bootstrap,
    login,
    registerStudent,
    registerInstructor,
    logout,
  }
})

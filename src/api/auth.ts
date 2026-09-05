import { apiClient } from '@/api/client'
import type {
  InstructorRegisterPayload,
  LoginPayload,
  StudentRegisterPayload,
  User,
} from '@/types/auth'

export const authApi = {
  me: () => apiClient.get<User>('/api/me'),
  login: (payload: LoginPayload) => apiClient.post<User>('/api/login', payload),
  logout: () => apiClient.post<{ message: string }>('/api/logout'),
  registerStudent: (payload: StudentRegisterPayload) =>
    apiClient.post<User>('/api/register/student', payload),
  registerInstructor: (payload: InstructorRegisterPayload) =>
    apiClient.post<User>('/api/register/instructor', payload),
}

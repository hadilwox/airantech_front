import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/types/api'
import type { Enrollment } from '@/types/enrollments'
import type { Student, StudentPayload } from '@/types/students'

export const studentsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiClient.get<PaginatedResponse<Student>>('/api/students', params),
  get: (id: number) => apiClient.get<Student>(`/api/students/${id}`),
  create: (payload: StudentPayload) => apiClient.post<Student>('/api/students', payload),
  update: (id: number, payload: Partial<StudentPayload>) => apiClient.put<Student>(`/api/students/${id}`, payload),
  remove: (id: number) => apiClient.delete<void>(`/api/students/${id}`),
  courses: (id: number, params?: Record<string, string | number | boolean | undefined>) =>
    apiClient.get<PaginatedResponse<Enrollment>>(`/api/students/${id}/courses`, params),
}

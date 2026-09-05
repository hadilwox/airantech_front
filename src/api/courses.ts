import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/types/api'
import type { Course, CoursePayload } from '@/types/courses'
import type { Enrollment } from '@/types/enrollments'

export const coursesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiClient.get<PaginatedResponse<Course>>('/api/courses', params),
  get: (id: number) => apiClient.get<Course>(`/api/courses/${id}`),
  create: (payload: CoursePayload) => apiClient.post<Course>('/api/courses', payload),
  update: (id: number, payload: Partial<CoursePayload>) => apiClient.put<Course>(`/api/courses/${id}`, payload),
  remove: (id: number) => apiClient.delete<void>(`/api/courses/${id}`),
  students: (id: number, params?: Record<string, string | number | boolean | undefined>) =>
    apiClient.get<PaginatedResponse<Enrollment>>(`/api/courses/${id}/students`, params),
}

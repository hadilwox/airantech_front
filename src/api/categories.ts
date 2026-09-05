import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/types/api'
import type { CourseCategory, CourseCategoryPayload } from '@/types/categories'

export const categoriesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiClient.get<PaginatedResponse<CourseCategory>>('/api/course-categories', params),
  get: (id: number) => apiClient.get<CourseCategory>(`/api/course-categories/${id}`),
  create: (payload: CourseCategoryPayload) => apiClient.post<CourseCategory>('/api/course-categories', payload),
  update: (id: number, payload: Partial<CourseCategoryPayload>) =>
    apiClient.put<CourseCategory>(`/api/course-categories/${id}`, payload),
  remove: (id: number) => apiClient.delete<void>(`/api/course-categories/${id}`),
}

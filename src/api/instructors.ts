import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/types/api'
import type { Instructor, InstructorPayload } from '@/types/instructors'

export const instructorsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiClient.get<PaginatedResponse<Instructor>>('/api/instructors', params),
  get: (id: number) => apiClient.get<Instructor>(`/api/instructors/${id}`),
  create: (payload: InstructorPayload) => apiClient.post<Instructor>('/api/instructors', payload),
  update: (id: number, payload: Partial<InstructorPayload>) =>
    apiClient.put<Instructor>(`/api/instructors/${id}`, payload),
  remove: (id: number) => apiClient.delete<void>(`/api/instructors/${id}`),
}

import { apiClient } from '@/api/client'
import type { PaginatedResponse } from '@/types/api'
import type { Enrollment, EnrollmentCreatePayload, EnrollmentUpdatePayload } from '@/types/enrollments'

export const enrollmentsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiClient.get<PaginatedResponse<Enrollment>>('/api/enrollments', params),
  get: (id: number) => apiClient.get<Enrollment>(`/api/enrollments/${id}`),
  create: (payload: EnrollmentCreatePayload) => apiClient.post<Enrollment>('/api/enrollments', payload),
  update: (id: number, payload: EnrollmentUpdatePayload) => apiClient.put<Enrollment>(`/api/enrollments/${id}`, payload),
  remove: (id: number) => apiClient.delete<void>(`/api/enrollments/${id}`),
}

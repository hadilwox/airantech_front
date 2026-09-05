import type { Course } from '@/types/courses'
import type { Student } from '@/types/students'

export type EnrollmentStatus = 'active' | 'completed' | 'withdrawn' | 'cancelled'
export type EnrollmentPaymentStatus = 'unpaid' | 'partially_paid' | 'fully_paid' | 'overdue'

export interface Enrollment {
  id: number
  student: Student
  course: Course
  enrolled_at: string
  tuition_amount: string
  paid_amount: string
  remaining_amount: number
  payment_status: EnrollmentPaymentStatus
  status: EnrollmentStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface EnrollmentCreatePayload {
  student_id: number
  course_id: number
  enrolled_at?: string
  notes?: string
}

export interface EnrollmentUpdatePayload {
  status?: EnrollmentStatus
  paid_amount?: number
  notes?: string
}

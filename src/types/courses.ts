import type { CourseCategory } from '@/types/categories'
import type { Instructor } from '@/types/instructors'

export type CourseStatus = 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export type WeekDay = 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'

export interface Course {
  id: number
  code: string
  jalali_year: number
  jalali_month: number
  title: string
  category: CourseCategory
  instructor: Instructor | null
  teaching_hours: number | null
  capacity: number
  tuition_fee: string
  instructor_cost: string | null
  has_university_certificate: boolean
  exam_introduced_count: number
  exam_passed_count: number
  exam_retake_count: number
  schedule_days: WeekDay[] | null
  status: CourseStatus
  start_date: string | null
  end_date: string | null
  description: string | null
  enrollments_count?: number
  created_at: string
  updated_at: string
}

export interface CoursePayload {
  category_id: number
  instructor_id?: number | null
  title: string
  teaching_hours?: number
  capacity: number
  tuition_fee: number
  instructor_cost?: number
  has_university_certificate?: boolean
  schedule_days?: WeekDay[]
  status?: CourseStatus
  start_date?: string | null
  end_date?: string | null
  description?: string
}

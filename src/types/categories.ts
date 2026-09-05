export interface CourseCategory {
  id: number
  name: string
  code_prefix: string
  is_active: boolean
  courses_count?: number
  created_at: string
  updated_at: string
}

export interface CourseCategoryPayload {
  name: string
  code_prefix: string
  is_active?: boolean
}

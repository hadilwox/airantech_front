export interface Student {
  id: number
  student_code: string | null
  national_id: string
  first_name: string
  last_name: string
  father_name: string | null
  date_of_birth: string | null
  mobile_phone: string
  landline_phone: string | null
  emergency_phone: string | null
  education_level: string | null
  address: string | null
  postal_code: string | null
  email: string
  is_active?: boolean
  enrollments_count?: number
  created_at: string
  updated_at: string
}

export interface StudentPayload {
  email: string
  password?: string
  password_confirmation?: string
  first_name: string
  last_name: string
  father_name?: string
  national_id: string
  date_of_birth?: string | null
  mobile_phone: string
  landline_phone?: string
  emergency_phone?: string
  education_level?: string
  address?: string
  postal_code?: string
  is_active?: boolean
}

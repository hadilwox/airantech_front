export type InstructorStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'

export interface Instructor {
  id: number
  first_name: string
  last_name: string
  father_name: string | null
  national_id: string
  residence: string | null
  marital_status: string | null
  date_of_birth: string | null
  mobile_phone: string
  landline_phone: string | null
  emergency_phone: string | null
  education_degree: string | null
  expected_salary: string | null
  skills: string | null
  work_experience: string | null
  status: InstructorStatus
  email?: string
  is_active?: boolean
  courses_count?: number
  created_at: string
  updated_at: string
}

export interface InstructorPayload {
  email: string
  password?: string
  password_confirmation?: string
  first_name: string
  last_name: string
  father_name?: string
  national_id: string
  residence?: string
  marital_status?: string
  date_of_birth?: string | null
  mobile_phone: string
  landline_phone?: string
  emergency_phone?: string
  education_degree?: string
  expected_salary?: number
  skills?: string
  work_experience?: string
  status?: InstructorStatus
  is_active?: boolean
}

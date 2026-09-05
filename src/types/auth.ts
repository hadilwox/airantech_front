export interface StudentSummary {
  id: number
  student_code: string | null
  first_name: string
  last_name: string
}

export type InstructorStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'

export interface InstructorSummary {
  id: number
  first_name: string
  last_name: string
  status: InstructorStatus
}

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  is_active: boolean
  roles: string[]
  permissions: string[]
  student?: StudentSummary | null
  instructor?: InstructorSummary | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface StudentRegisterPayload {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
  father_name?: string
  national_id: string
  date_of_birth?: string
  mobile_phone: string
  landline_phone?: string
  emergency_phone?: string
  education_level?: string
  address?: string
  postal_code?: string
}

export interface InstructorRegisterPayload {
  email: string
  password: string
  password_confirmation: string
  first_name: string
  last_name: string
  father_name?: string
  national_id: string
  residence?: string
  marital_status?: string
  date_of_birth?: string
  mobile_phone: string
  landline_phone?: string
  emergency_phone?: string
  education_degree?: string
  expected_salary?: number
  skills?: string
  work_experience?: string
}

import type { CourseStatus } from '@/types/courses'
import type { EnrollmentPaymentStatus, EnrollmentStatus } from '@/types/enrollments'
import type { InstructorStatus } from '@/types/instructors'

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive'

export const instructorStatusLabels: Record<InstructorStatus, string> = {
  pending: 'در انتظار تأیید',
  approved: 'تأیید شده',
  rejected: 'رد شده',
  active: 'فعال',
  inactive: 'غیرفعال',
}
export const instructorStatusVariant: Record<InstructorStatus, BadgeVariant> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
  active: 'success',
  inactive: 'default',
}

export const courseStatusLabels: Record<CourseStatus, string> = {
  draft: 'پیش‌نویس',
  upcoming: 'در حال شروع',
  ongoing: 'در حال برگزاری',
  completed: 'پایان یافته',
  cancelled: 'لغو شده',
}
export const courseStatusVariant: Record<CourseStatus, BadgeVariant> = {
  draft: 'default',
  upcoming: 'warning',
  ongoing: 'success',
  completed: 'default',
  cancelled: 'destructive',
}

export const enrollmentStatusLabels: Record<EnrollmentStatus, string> = {
  active: 'فعال',
  completed: 'تکمیل شده',
  withdrawn: 'انصراف داده',
  cancelled: 'لغو شده',
}

export const enrollmentPaymentLabels: Record<EnrollmentPaymentStatus, string> = {
  unpaid: 'پرداخت نشده',
  partially_paid: 'پرداخت جزئی',
  fully_paid: 'تسویه شده',
  overdue: 'معوق',
}
export const enrollmentPaymentVariant: Record<EnrollmentPaymentStatus, BadgeVariant> = {
  unpaid: 'destructive',
  partially_paid: 'warning',
  fully_paid: 'success',
  overdue: 'destructive',
}

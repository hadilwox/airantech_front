export interface ApiErrorPayload {
  status: number
  message: string
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly status: number
  readonly errors?: Record<string, string[]>

  constructor({ status, message, errors }: ApiErrorPayload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }

  /** First validation message for a field, if any (for inline form errors). */
  fieldError(field: string): string | undefined {
    return this.errors?.[field]?.[0]
  }
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

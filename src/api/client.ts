import { ApiError } from '@/types/api'

const API_URL = import.meta.env.VITE_API_URL

let csrfReady: Promise<void> | null = null

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/** Sanctum SPA auth needs the CSRF cookie set once before any mutating request. */
function ensureCsrfCookie(): Promise<void> {
  if (!csrfReady) {
    csrfReady = fetch(`${API_URL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    }).then(() => undefined)
  }

  return csrfReady
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

async function request<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  if (method !== 'GET') {
    await ensureCsrfCookie()
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(method !== 'GET' ? { 'X-XSRF-TOKEN': readCookie('XSRF-TOKEN') ?? '' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      message: payload?.message ?? 'خطایی رخ داد.',
      errors: payload?.errors,
    })
  }

  return payload as T
}

export function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return ''

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }

  const query = search.toString()
  return query ? `?${query}` : ''
}

export const apiClient = {
  get: <T>(path: string, params?: Record<string, string | number | boolean | undefined>) =>
    request<T>(`${path}${buildQuery(params)}`),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

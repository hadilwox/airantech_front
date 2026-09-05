import { computed, reactive, ref, watch } from 'vue'

import type { PaginatedResponse } from '@/types/api'

export function usePaginatedResource<T>(fetcher: (params: Record<string, string | number | boolean>) => Promise<PaginatedResponse<T>>) {
  const items = ref<T[]>([])
  const loading = ref(false)
  const error = ref('')
  const page = ref(1)
  const perPage = ref(15)
  const lastPage = ref(1)
  const total = ref(0)

  const filters = reactive<Record<string, string | number | boolean | undefined>>({})

  const hasItems = computed(() => items.value.length > 0)

  async function load(): Promise<void> {
    loading.value = true
    error.value = ''

    const params: Record<string, string | number | boolean> = {
      page: page.value,
      per_page: perPage.value,
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') {
        params[key] = value
      }
    }

    try {
      const response = await fetcher(params)
      items.value = response.data
      lastPage.value = response.meta.last_page
      total.value = response.meta.total
    } catch {
      error.value = 'بارگذاری اطلاعات با خطا مواجه شد.'
    } finally {
      loading.value = false
    }
  }

  function setFilter(key: string, value: string | number | boolean | undefined): void {
    filters[key] = value
    page.value = 1
  }

  watch(page, load)

  return {
    items,
    loading,
    error,
    page,
    perPage,
    lastPage,
    total,
    hasItems,
    filters,
    setFilter,
    load,
  }
}

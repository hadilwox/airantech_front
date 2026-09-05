<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

import { toPersianDigits } from '@/utils/jalali'

const props = defineProps<{ page: number; lastPage: number; total: number }>()
const emit = defineEmits<{ 'update:page': [value: number] }>()

function go(page: number) {
  if (page >= 1 && page <= props.lastPage) emit('update:page', page)
}
</script>

<template>
  <div class="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
    <span>{{ toPersianDigits(total) }} مورد</span>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-lg border border-border disabled:opacity-40"
        :disabled="page <= 1"
        @click="go(page - 1)"
      >
        <IconChevronRight class="size-4" />
      </button>
      <span>{{ toPersianDigits(page) }} از {{ toPersianDigits(lastPage) }}</span>
      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-lg border border-border disabled:opacity-40"
        :disabled="page >= lastPage"
        @click="go(page + 1)"
      >
        <IconChevronLeft class="size-4" />
      </button>
    </div>
  </div>
</template>

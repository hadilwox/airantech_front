<script setup lang="ts" generic="T extends { id: number | string }">
import Spinner from '@/components/ui/Spinner.vue'

export interface Column<T> {
  key: string
  label: string
  class?: string
}

defineProps<{
  columns: Column<T>[]
  rows: T[]
  loading: boolean
  emptyMessage?: string
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-xl border border-border bg-card">
    <table class="w-full min-w-max text-sm">
      <thead>
        <tr class="border-b border-border text-start text-xs font-medium text-muted-foreground">
          <th v-for="column in columns" :key="column.key" class="px-4 py-3 text-start" :class="column.class">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-4 py-10 text-center">
            <Spinner class="mx-auto" />
          </td>
        </tr>
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length" class="px-4 py-10 text-center text-sm text-muted-foreground">
            {{ emptyMessage ?? 'موردی یافت نشد.' }}
          </td>
        </tr>
        <tr v-for="row in rows" v-else :key="row.id" class="border-b border-border last:border-0 hover:bg-muted/50">
          <td v-for="column in columns" :key="column.key" class="px-4 py-3 align-middle" :class="column.class">
            <slot :name="`cell-${column.key}`" :row="row">
              {{ (row as Record<string, unknown>)[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

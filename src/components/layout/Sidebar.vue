<script setup lang="ts">
import { IconCategory, IconClipboardList, IconHome, IconSchool, IconUsers, IconUserStar } from '@tabler/icons-vue'
import { RouterLink } from 'vue-router'

import { usePermission } from '@/composables/usePermission'

const { can } = usePermission()

const navItems = [
  { to: 'dashboard', label: 'داشبورد', icon: IconHome, permission: null },
  { to: 'students', label: 'دانشجویان', icon: IconUsers, permission: 'students.view' },
  { to: 'instructors', label: 'مدرسین', icon: IconUserStar, permission: 'instructors.view' },
  { to: 'categories', label: 'دسته‌بندی دوره‌ها', icon: IconCategory, permission: 'categories.view' },
  { to: 'courses', label: 'دوره‌ها', icon: IconSchool, permission: 'courses.view' },
  { to: 'enrollments', label: 'ثبت‌نام‌ها', icon: IconClipboardList, permission: 'enrollments.view' },
] as const
</script>

<template>
  <aside class="hidden w-64 shrink-0 border-e border-border bg-card md:flex md:flex-col">
    <div class="flex h-16 items-center gap-2 border-b border-border px-6">
      <span
        class="size-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600"
        aria-hidden="true"
      />
      <span class="text-lg font-bold text-foreground">آکادمی</span>
    </div>

    <nav class="flex flex-col gap-1 p-3">
      <template v-for="item in navItems" :key="item.to">
        <RouterLink
          v-if="!item.permission || can(item.permission)"
          :to="{ name: item.to }"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          active-class="bg-accent/10 text-accent"
        >
          <component :is="item.icon" class="size-5" />
          {{ item.label }}
        </RouterLink>
      </template>
    </nav>
  </aside>
</template>

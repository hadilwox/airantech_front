<script setup lang="ts">
import { IconMoon, IconSun } from '@tabler/icons-vue'

import { useThemeStore } from '@/stores/theme'

const theme = useThemeStore()
</script>

<template>
  <button
    type="button"
    class="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
    :aria-label="theme.theme === 'dark' ? 'روشن کردن پوسته' : 'تاریک کردن پوسته'"
    @click="theme.toggle()"
  >
    <IconSun v-if="theme.theme === 'dark'" class="size-5" />
    <IconMoon v-else class="size-5" />
  </button>
</template>

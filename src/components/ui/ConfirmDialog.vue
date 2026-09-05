<script setup lang="ts">
import { IconAlertTriangle } from '@tabler/icons-vue'

import Button from '@/components/ui/Button.vue'

withDefaults(
  defineProps<{
    open: boolean
    title: string
    message: string
    confirmLabel?: string
    loading?: boolean
  }>(),
  {
    confirmLabel: 'تأیید',
    loading: false,
  },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="emit('cancel')" />
      <div class="relative z-10 w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-xl">
        <div class="mb-3 flex items-center gap-2 text-destructive">
          <IconAlertTriangle class="size-5" />
          <h2 class="text-sm font-semibold text-foreground">{{ title }}</h2>
        </div>
        <p class="mb-5 text-sm text-muted-foreground">{{ message }}</p>
        <div class="flex justify-end gap-2">
          <Button variant="secondary" @click="emit('cancel')">انصراف</Button>
          <Button variant="destructive" :loading="loading" @click="emit('confirm')">{{ confirmLabel }}</Button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

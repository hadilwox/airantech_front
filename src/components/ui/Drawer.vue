<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'

defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/50" @click="emit('close')" />
      <div class="fixed inset-y-0 end-0 z-10 h-full w-full max-w-md overflow-y-auto border-s border-border bg-card shadow-xl">
        <div class="sticky top-0 flex items-center justify-between border-b border-border bg-card px-5 py-4">
          <h2 class="text-sm font-semibold text-foreground">{{ title }}</h2>
          <button
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            @click="emit('close')"
          >
            <IconX class="size-4" />
          </button>
        </div>
        <div class="p-5">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

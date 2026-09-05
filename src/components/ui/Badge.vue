<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'success' | 'warning' | 'destructive'
  }>(),
  {
    variant: 'default',
  },
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-success/15 text-success'
    case 'warning':
      return 'bg-warning/15 text-warning'
    case 'destructive':
      return 'bg-destructive/15 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
    :class="variantClasses"
  >
    <slot />
  </span>
</template>

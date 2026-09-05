<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
    type?: 'button' | 'submit'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    variant: 'primary',
    type: 'button',
    disabled: false,
    loading: false,
  },
)

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-muted text-foreground hover:bg-border'
    case 'ghost':
      return 'bg-transparent text-foreground hover:bg-muted'
    case 'destructive':
      return 'bg-destructive text-destructive-foreground hover:opacity-90'
    default:
      return 'bg-accent text-accent-foreground hover:opacity-90'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
    :class="variantClasses"
  >
    <span
      v-if="loading"
      class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

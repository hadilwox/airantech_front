<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })
</script>

<template>
  <span
    class="inline-block animate-spin rounded-full border-2 border-muted border-t-accent"
    :class="{ 'size-4': size === 'sm', 'size-6': size === 'md', 'size-10': size === 'lg' }"
    role="status"
    aria-label="در حال بارگذاری"
  />
</template>

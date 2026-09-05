<script setup lang="ts">
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
import UserMenu from '@/components/layout/UserMenu.vue'
</script>

<template>
  <header
    class="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6"
  >
    <div />
    <div class="flex items-center gap-2">
      <ThemeToggle />
      <UserMenu />
    </div>
  </header>
</template>

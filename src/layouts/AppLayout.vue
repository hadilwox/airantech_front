<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue'
import Topbar from '@/components/layout/Topbar.vue'
</script>

<template>
  <div class="flex min-h-screen bg-background">
    <Sidebar />
    <div class="flex min-w-0 flex-1 flex-col">
      <Topbar />
      <main class="flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

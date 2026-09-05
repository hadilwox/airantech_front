<script setup lang="ts">
import { RouterLink } from 'vue-router'

import Button from '@/components/ui/Button.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
    <h1 class="text-3xl font-bold text-foreground">۴۰۳</h1>
    <p class="text-muted-foreground">شما دسترسی لازم برای مشاهده این صفحه را ندارید.</p>
    <RouterLink :to="{ name: 'dashboard' }">
      <Button variant="secondary">بازگشت به داشبورد</Button>
    </RouterLink>
  </div>
</template>

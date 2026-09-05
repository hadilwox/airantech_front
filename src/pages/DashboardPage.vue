<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'
import Card from '@/components/ui/Card.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <AppLayout>
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-xl font-bold text-foreground">
          خوش آمدید، {{ auth.user?.name }}
        </h1>
        <p class="text-sm text-muted-foreground">
          این داشبورد نسخه اولیه است؛ بخش‌های اختصاصی هر نقش در فازهای بعدی اضافه می‌شود.
        </p>
      </div>

      <Card>
        <h2 class="mb-4 text-sm font-semibold text-muted-foreground">نقش‌ها</h2>
        <div class="flex flex-wrap gap-2">
          <Badge v-for="role in auth.roles" :key="role">{{ role }}</Badge>
        </div>
      </Card>

      <Card>
        <h2 class="mb-4 text-sm font-semibold text-muted-foreground">دسترسی‌ها</h2>
        <div v-if="auth.permissions.length" class="flex flex-wrap gap-2">
          <Badge v-for="permission in auth.permissions" :key="permission" variant="success">
            {{ permission }}
          </Badge>
        </div>
        <p v-else class="text-sm text-muted-foreground">دسترسی خاصی برای این نقش تعریف نشده است.</p>
      </Card>
    </div>
  </AppLayout>
</template>

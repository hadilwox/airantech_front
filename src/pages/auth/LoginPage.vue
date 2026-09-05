<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/types/api'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const errors = reactive<{ email?: string; password?: string }>({})
const generalError = ref('')
const loading = ref(false)

async function handleSubmit() {
  errors.email = undefined
  errors.password = undefined
  generalError.value = ''
  loading.value = true

  try {
    await auth.login(form)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      errors.email = error.fieldError('email')
      errors.password = error.fieldError('password')
    } else if (error instanceof ApiError) {
      generalError.value = error.message
    } else {
      generalError.value = 'ارتباط با سرور برقرار نشد.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <Card>
      <h2 class="mb-6 text-lg font-semibold text-foreground">ورود به حساب کاربری</h2>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <Input
          v-model="form.email"
          type="email"
          label="ایمیل"
          required
          :error="errors.email"
        />
        <Input
          v-model="form.password"
          type="password"
          label="رمز عبور"
          required
          :error="errors.password"
        />

        <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>

        <Button type="submit" :loading="loading" class="mt-2 w-full">ورود</Button>
      </form>

      <p class="mt-6 text-center text-sm text-muted-foreground">
        دانشجو هستید؟
        <RouterLink :to="{ name: 'register-student' }" class="text-accent hover:underline">
          ثبت‌نام دانشجو
        </RouterLink>
      </p>
      <p class="mt-2 text-center text-sm text-muted-foreground">
        مدرس هستید؟
        <RouterLink :to="{ name: 'register-instructor' }" class="text-accent hover:underline">
          ثبت‌نام مدرس
        </RouterLink>
      </p>
    </Card>
  </AuthLayout>
</template>

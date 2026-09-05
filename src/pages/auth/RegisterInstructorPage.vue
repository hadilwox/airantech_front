<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { ApiError } from '@/types/api'
import type { InstructorRegisterPayload } from '@/types/auth'

const auth = useAuthStore()
const router = useRouter()

const form = reactive<InstructorRegisterPayload>({
  email: '',
  password: '',
  password_confirmation: '',
  first_name: '',
  last_name: '',
  national_id: '',
  mobile_phone: '',
})

const errors = reactive<Partial<Record<keyof InstructorRegisterPayload, string>>>({})
const generalError = ref('')
const loading = ref(false)

async function handleSubmit() {
  Object.keys(errors).forEach((key) => delete errors[key as keyof InstructorRegisterPayload])
  generalError.value = ''
  loading.value = true

  try {
    await auth.registerInstructor(form)
    router.push({ name: 'dashboard' })
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.errors) {
      for (const field of Object.keys(error.errors)) {
        errors[field as keyof InstructorRegisterPayload] = error.fieldError(field)
      }
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
      <h2 class="mb-6 text-lg font-semibold text-foreground">ثبت‌نام مدرس</h2>
      <p class="mb-4 text-sm text-muted-foreground">
        درخواست شما پس از ثبت، در انتظار تأیید مدیر آکادمی خواهد بود.
      </p>

      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div class="grid grid-cols-2 gap-4">
          <Input v-model="form.first_name" label="نام" required :error="errors.first_name" />
          <Input v-model="form.last_name" label="نام خانوادگی" required :error="errors.last_name" />
        </div>
        <Input v-model="form.national_id" label="کد ملی" required :error="errors.national_id" />
        <Input v-model="form.mobile_phone" label="شماره موبایل" required :error="errors.mobile_phone" />
        <Input v-model="form.email" type="email" label="ایمیل" required :error="errors.email" />
        <Input
          v-model="form.password"
          type="password"
          label="رمز عبور"
          required
          :error="errors.password"
        />
        <Input
          v-model="form.password_confirmation"
          type="password"
          label="تکرار رمز عبور"
          required
        />

        <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>

        <Button type="submit" :loading="loading" class="mt-2 w-full">ارسال درخواست</Button>
      </form>

      <p class="mt-6 text-center text-sm text-muted-foreground">
        قبلاً ثبت‌نام کرده‌اید؟
        <RouterLink :to="{ name: 'login' }" class="text-accent hover:underline">ورود</RouterLink>
      </p>
    </Card>
  </AuthLayout>
</template>

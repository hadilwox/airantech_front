<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import { coursesApi } from '@/api/courses'
import { enrollmentsApi } from '@/api/enrollments'
import { studentsApi } from '@/api/students'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import Select from '@/components/ui/Select.vue'
import { ApiError } from '@/types/api'
import type { Course } from '@/types/courses'
import type { Student } from '@/types/students'
import { formatToman } from '@/utils/format'

const props = defineProps<{ open: boolean; presetStudentId?: number; presetCourseId?: number }>()
const emit = defineEmits<{ close: []; enrolled: [] }>()

const studentId = ref<number | null>(props.presetStudentId ?? null)
const courseId = ref<number | null>(props.presetCourseId ?? null)
const notes = ref('')
const generalError = ref('')
const submitting = ref(false)
const errors = reactive<{ student_id?: string; course_id?: string }>({})

const students = ref<Student[]>([])
const courses = ref<Course[]>([])

watch(
  () => props.open,
  async (open) => {
    if (!open) return

    studentId.value = props.presetStudentId ?? null
    courseId.value = props.presetCourseId ?? null
    notes.value = ''
    generalError.value = ''
    errors.student_id = undefined
    errors.course_id = undefined

    if (!props.presetStudentId) {
      students.value = (await studentsApi.list({ per_page: 100 })).data
    }
    if (!props.presetCourseId) {
      courses.value = (await coursesApi.list({ per_page: 100 })).data
    }
  },
)

const selectedCourse = computed(() => courses.value.find((c) => c.id === courseId.value))

const studentOptions = computed(() =>
  students.value.map((s) => ({ value: s.id, label: `${s.first_name} ${s.last_name} (${s.student_code ?? s.national_id})` })),
)
const courseOptions = computed(() => courses.value.map((c) => ({ value: c.id, label: `${c.title} — ${c.code}` })))

async function submit() {
  if (!studentId.value || !courseId.value) return

  generalError.value = ''
  errors.student_id = undefined
  errors.course_id = undefined
  submitting.value = true

  try {
    await enrollmentsApi.create({
      student_id: studentId.value,
      course_id: courseId.value,
      notes: notes.value || undefined,
    })
    emit('enrolled')
    emit('close')
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      errors.student_id = error.fieldError('student_id')
      errors.course_id = error.fieldError('course_id')
    } else if (error instanceof ApiError) {
      generalError.value = error.message
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Modal :open="open" title="ثبت‌نام دانشجو در دوره" @close="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <Select
        v-if="!presetStudentId"
        v-model="studentId"
        label="دانشجو"
        required
        :options="studentOptions"
        :error="errors.student_id"
      />
      <Select
        v-if="!presetCourseId"
        v-model="courseId"
        label="دوره"
        required
        :options="courseOptions"
        :error="errors.course_id"
      />

      <div v-if="selectedCourse" class="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
        شهریه این دوره: <span class="font-medium text-foreground">{{ formatToman(selectedCourse.tuition_fee) }}</span>
      </div>

      <label class="flex flex-col gap-1.5 text-sm font-medium text-foreground">
        یادداشت (اختیاری)
        <textarea v-model="notes" rows="2" class="rounded-lg border border-border bg-card px-3 py-2 text-sm" />
      </label>

      <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>

      <Button type="submit" :loading="submitting" class="w-full" :disabled="!studentId || !courseId">ثبت‌نام</Button>
    </form>
  </Modal>
</template>

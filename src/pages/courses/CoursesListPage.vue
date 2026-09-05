<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { IconPencil, IconPlus, IconTrash, IconUserPlus } from '@tabler/icons-vue'

import { categoriesApi } from '@/api/categories'
import { coursesApi } from '@/api/courses'
import { instructorsApi } from '@/api/instructors'
import EnrollStudentModal from '@/components/enrollments/EnrollStudentModal.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Column } from '@/components/ui/DataTable.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Drawer from '@/components/ui/Drawer.vue'
import Input from '@/components/ui/Input.vue'
import JalaliDateInput from '@/components/ui/JalaliDateInput.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import Select from '@/components/ui/Select.vue'
import { usePaginatedResource } from '@/composables/usePaginatedResource'
import { usePermission } from '@/composables/usePermission'
import AppLayout from '@/layouts/AppLayout.vue'
import { ApiError } from '@/types/api'
import type { CourseCategory } from '@/types/categories'
import type { Course, CoursePayload, WeekDay } from '@/types/courses'
import type { Enrollment } from '@/types/enrollments'
import type { Instructor } from '@/types/instructors'
import { formatToman } from '@/utils/format'
import { toJalaliDisplay } from '@/utils/jalali'
import {
  courseStatusLabels as statusLabels,
  courseStatusVariant as statusVariant,
  enrollmentPaymentLabels,
  enrollmentPaymentVariant,
  enrollmentStatusLabels,
} from '@/utils/labels'

const { can } = usePermission()

const { items, loading, page, lastPage, total, load, setFilter } = usePaginatedResource((params) =>
  coursesApi.list(params),
)
load()

const categories = ref<CourseCategory[]>([])
const instructors = ref<Instructor[]>([])

onMounted(async () => {
  categories.value = (await categoriesApi.list({ per_page: 100 })).data
  instructors.value = (await instructorsApi.list({ per_page: 100 })).data
})

const categoryOptions = computed(() => categories.value.map((c) => ({ value: c.id, label: c.name })))
const instructorOptions = computed(() => instructors.value.map((i) => ({ value: i.id, label: `${i.first_name} ${i.last_name}` })))

const columns: Column<Course>[] = [
  { key: 'code', label: 'کد دوره' },
  { key: 'title', label: 'عنوان' },
  { key: 'category', label: 'دسته‌بندی' },
  { key: 'instructor', label: 'مدرس' },
  { key: 'capacity', label: 'ظرفیت' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: '', class: 'text-left' },
]

const weekDayLabels: Record<WeekDay, string> = {
  saturday: 'شنبه',
  sunday: 'یکشنبه',
  monday: 'دوشنبه',
  tuesday: 'سه‌شنبه',
  wednesday: 'چهارشنبه',
  thursday: 'پنجشنبه',
  friday: 'جمعه',
}

const searchTerm = ref('')
function onSearch(value: string) {
  searchTerm.value = value
  setFilter('q', value)
  load()
}

const emptyForm = (): CoursePayload => ({
  category_id: 0,
  instructor_id: null,
  title: '',
  teaching_hours: undefined,
  capacity: 10,
  tuition_fee: 0,
  schedule_days: [],
  start_date: null,
  end_date: null,
  description: '',
})

const modalOpen = ref(false)
const editing = ref<Course | null>(null)
const form = reactive<CoursePayload>(emptyForm())
const errors = reactive<Partial<Record<keyof CoursePayload, string>>>({})
const submitting = ref(false)
const generalError = ref('')

function openCreate() {
  editing.value = null
  Object.assign(form, emptyForm())
  clearErrors()
  modalOpen.value = true
}

function openEdit(course: Course) {
  editing.value = course
  Object.assign(form, {
    category_id: course.category.id,
    instructor_id: course.instructor?.id ?? null,
    title: course.title,
    teaching_hours: course.teaching_hours ?? undefined,
    capacity: course.capacity,
    tuition_fee: Number(course.tuition_fee),
    instructor_cost: course.instructor_cost ? Number(course.instructor_cost) : undefined,
    has_university_certificate: course.has_university_certificate,
    schedule_days: course.schedule_days ?? [],
    status: course.status,
    start_date: course.start_date,
    end_date: course.end_date,
    description: course.description ?? '',
  })
  clearErrors()
  modalOpen.value = true
}

function clearErrors() {
  generalError.value = ''
  for (const key of Object.keys(errors) as (keyof CoursePayload)[]) errors[key] = undefined
}

function toggleWeekDay(day: WeekDay) {
  const current = form.schedule_days ?? []
  form.schedule_days = current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
}

async function submit() {
  clearErrors()
  submitting.value = true

  try {
    if (editing.value) {
      const { category_id: _categoryId, ...updatePayload } = form
      await coursesApi.update(editing.value.id, updatePayload)
    } else {
      await coursesApi.create(form)
    }
    modalOpen.value = false
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.errors) {
      for (const field of Object.keys(error.errors)) {
        errors[field as keyof CoursePayload] = error.fieldError(field)
      }
    } else if (error instanceof ApiError) {
      generalError.value = error.message
    }
  } finally {
    submitting.value = false
  }
}

const deleteTarget = ref<Course | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await coursesApi.remove(deleteTarget.value.id)
    deleteTarget.value = null
    await load()
  } finally {
    deleting.value = false
  }
}

const detailCourse = ref<Course | null>(null)
const detailEnrollments = ref<Enrollment[]>([])
const detailLoading = ref(false)

async function openDetail(course: Course) {
  detailCourse.value = course
  detailLoading.value = true
  try {
    detailEnrollments.value = (await coursesApi.students(course.id, { per_page: 50 })).data
  } finally {
    detailLoading.value = false
  }
}

const enrollModalOpen = ref(false)

async function afterEnroll() {
  if (detailCourse.value) await openDetail(detailCourse.value)
  await load()
}
</script>

<template>
  <AppLayout>
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold text-foreground">دوره‌ها</h1>
        <Button v-if="can('courses.create')" @click="openCreate">
          <IconPlus class="size-4" />
          دوره جدید
        </Button>
      </div>

      <SearchInput v-model="searchTerm" placeholder="جستجو بر اساس عنوان یا کد دوره..." @update:model-value="onSearch" />

      <DataTable :columns="columns" :rows="items" :loading="loading">
        <template #cell-title="{ row }">
          <button type="button" class="text-start font-medium text-foreground hover:text-accent" @click="openDetail(row)">
            {{ row.title }}
          </button>
        </template>
        <template #cell-category="{ row }">{{ row.category.name }}</template>
        <template #cell-instructor="{ row }">{{ row.instructor ? `${row.instructor.first_name} ${row.instructor.last_name}` : '—' }}</template>
        <template #cell-status="{ row }">
          <Badge :variant="statusVariant[row.status]">{{ statusLabels[row.status] }}</Badge>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end gap-1">
            <button
              v-if="can('instructors.view')"
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              title="ویرایش"
              @click="openEdit(row)"
            >
              <IconPencil class="size-4" />
            </button>
            <button
              v-if="can('courses.delete')"
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              @click="deleteTarget = row"
            >
              <IconTrash class="size-4" />
            </button>
          </div>
        </template>
      </DataTable>

      <Pagination :page="page" :last-page="lastPage" :total="total" @update:page="(p) => (page = p)" />
    </div>

    <Modal :open="modalOpen" :title="editing ? 'ویرایش دوره' : 'دوره جدید'" @close="modalOpen = false">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div v-if="editing" class="rounded-lg bg-muted p-3 text-sm">
          کد دوره: <span class="font-medium text-foreground">{{ editing.code }}</span>
        </div>

        <Select
          v-model="form.category_id"
          label="دسته‌بندی"
          required
          :disabled="!!editing"
          :options="categoryOptions"
          :error="errors.category_id"
        />
        <Select v-model="form.instructor_id" label="مدرس" :options="instructorOptions" :error="errors.instructor_id" />
        <Input v-model="form.title" label="عنوان دوره" required :error="errors.title" />

        <div class="grid grid-cols-2 gap-4">
          <Input v-model="form.capacity" type="number" label="ظرفیت" required :error="errors.capacity" />
          <Input v-model="form.teaching_hours" type="number" label="ساعت آموزشی" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Input v-model="form.tuition_fee" type="number" label="شهریه (تومان)" required :error="errors.tuition_fee" />
          <Input v-model="form.instructor_cost" type="number" label="هزینه مدرس (تومان)" />
        </div>

        <div>
          <span class="mb-1.5 block text-sm font-medium text-foreground">روزهای برگزاری</span>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(label, day) in weekDayLabels"
              :key="day"
              type="button"
              class="rounded-full border px-3 py-1 text-xs"
              :class="form.schedule_days?.includes(day as WeekDay) ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground'"
              @click="toggleWeekDay(day as WeekDay)"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <JalaliDateInput v-model="form.start_date" label="تاریخ شروع" />
          <JalaliDateInput v-model="form.end_date" label="تاریخ پایان" />
        </div>

        <Select
          v-if="editing"
          v-model="form.status"
          label="وضعیت"
          :options="Object.entries(statusLabels).map(([value, label]) => ({ value, label }))"
        />

        <label class="flex items-center gap-2 text-sm text-foreground">
          <input v-model="form.has_university_certificate" type="checkbox" class="size-4 rounded border-border" />
          دارای مدرک دانشگاهی
        </label>

        <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>

        <Button type="submit" :loading="submitting" class="w-full">{{ editing ? 'ذخیره تغییرات' : 'ایجاد دوره' }}</Button>
      </form>
    </Modal>

    <ConfirmDialog
      :open="!!deleteTarget"
      title="حذف دوره"
      :message="`آیا از حذف دوره «${deleteTarget?.title}» مطمئن هستید؟`"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />

    <Drawer :open="!!detailCourse" :title="detailCourse?.title ?? ''" @close="detailCourse = null">
      <div v-if="detailCourse" class="flex flex-col gap-5">
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div><span class="text-muted-foreground">کد دوره:</span> {{ detailCourse.code }}</div>
          <div><span class="text-muted-foreground">ظرفیت:</span> {{ detailCourse.capacity }}</div>
          <div><span class="text-muted-foreground">شهریه:</span> {{ formatToman(detailCourse.tuition_fee) }}</div>
          <div><span class="text-muted-foreground">شروع:</span> {{ toJalaliDisplay(detailCourse.start_date) }}</div>
        </div>

        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-foreground">دانشجویان ثبت‌نام شده</h3>
          <Button v-if="can('enrollments.create')" variant="secondary" @click="enrollModalOpen = true">
            <IconUserPlus class="size-4" />
            ثبت‌نام دانشجو
          </Button>
        </div>

        <p v-if="detailLoading" class="text-sm text-muted-foreground">در حال بارگذاری...</p>
        <p v-else-if="detailEnrollments.length === 0" class="text-sm text-muted-foreground">دانشجویی ثبت‌نام نکرده است.</p>
        <ul v-else class="flex flex-col gap-2">
          <li v-for="enrollment in detailEnrollments" :key="enrollment.id" class="rounded-lg border border-border p-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="font-medium text-foreground">{{ enrollment.student.first_name }} {{ enrollment.student.last_name }}</span>
              <Badge>{{ enrollmentStatusLabels[enrollment.status] }}</Badge>
            </div>
            <div class="mt-1 text-xs text-muted-foreground">{{ enrollment.student.student_code }}</div>
            <div class="mt-1 text-xs">
              <Badge :variant="enrollmentPaymentVariant[enrollment.payment_status]">
                {{ enrollmentPaymentLabels[enrollment.payment_status] }}
              </Badge>
            </div>
          </li>
        </ul>
      </div>
    </Drawer>

    <EnrollStudentModal
      :open="enrollModalOpen"
      :preset-course-id="detailCourse?.id"
      @close="enrollModalOpen = false"
      @enrolled="afterEnroll"
    />
  </AppLayout>
</template>

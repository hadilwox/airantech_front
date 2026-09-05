<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IconPencil, IconPlus, IconTrash, IconUserPlus } from '@tabler/icons-vue'

import { studentsApi } from '@/api/students'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Column } from '@/components/ui/DataTable.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Drawer from '@/components/ui/Drawer.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import EnrollStudentModal from '@/components/enrollments/EnrollStudentModal.vue'
import { usePaginatedResource } from '@/composables/usePaginatedResource'
import { usePermission } from '@/composables/usePermission'
import AppLayout from '@/layouts/AppLayout.vue'
import { ApiError } from '@/types/api'
import type { Enrollment } from '@/types/enrollments'
import type { Student, StudentPayload } from '@/types/students'
import { toJalaliDisplay } from '@/utils/jalali'
import { enrollmentPaymentLabels, enrollmentPaymentVariant, enrollmentStatusLabels } from '@/utils/labels'

const { can } = usePermission()

const { items, loading, page, lastPage, total, load, setFilter } = usePaginatedResource((params) =>
  studentsApi.list(params),
)
load()

const columns: Column<Student>[] = [
  { key: 'student_code', label: 'کد دانشجویی' },
  { key: 'name', label: 'نام' },
  { key: 'national_id', label: 'کد ملی' },
  { key: 'mobile_phone', label: 'موبایل' },
  { key: 'is_active', label: 'وضعیت' },
  { key: 'actions', label: '', class: 'text-left' },
]

const searchTerm = ref('')
function onSearch(value: string) {
  searchTerm.value = value
  setFilter('q', value)
  load()
}

const emptyForm = (): StudentPayload => ({
  email: '',
  first_name: '',
  last_name: '',
  father_name: '',
  national_id: '',
  date_of_birth: null,
  mobile_phone: '',
  landline_phone: '',
  emergency_phone: '',
  education_level: '',
  address: '',
  postal_code: '',
})

const modalOpen = ref(false)
const editing = ref<Student | null>(null)
const form = reactive<StudentPayload>(emptyForm())
const errors = reactive<Partial<Record<keyof StudentPayload, string>>>({})
const submitting = ref(false)
const generalError = ref('')

function openCreate() {
  editing.value = null
  Object.assign(form, emptyForm())
  clearErrors()
  modalOpen.value = true
}

function openEdit(student: Student) {
  editing.value = student
  Object.assign(form, {
    email: student.email,
    first_name: student.first_name,
    last_name: student.last_name,
    father_name: student.father_name ?? '',
    national_id: student.national_id,
    date_of_birth: student.date_of_birth,
    mobile_phone: student.mobile_phone,
    landline_phone: student.landline_phone ?? '',
    emergency_phone: student.emergency_phone ?? '',
    education_level: student.education_level ?? '',
    address: student.address ?? '',
    postal_code: student.postal_code ?? '',
  })
  clearErrors()
  modalOpen.value = true
}

function clearErrors() {
  generalError.value = ''
  for (const key of Object.keys(errors) as (keyof StudentPayload)[]) errors[key] = undefined
}

async function submit() {
  clearErrors()
  submitting.value = true

  try {
    if (editing.value) {
      await studentsApi.update(editing.value.id, form)
    } else {
      await studentsApi.create(form)
    }
    modalOpen.value = false
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.errors) {
      for (const field of Object.keys(error.errors)) {
        errors[field as keyof StudentPayload] = error.fieldError(field)
      }
    } else if (error instanceof ApiError) {
      generalError.value = error.message
    }
  } finally {
    submitting.value = false
  }
}

const deleteTarget = ref<Student | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await studentsApi.remove(deleteTarget.value.id)
    deleteTarget.value = null
    await load()
  } finally {
    deleting.value = false
  }
}

const detailStudent = ref<Student | null>(null)
const detailEnrollments = ref<Enrollment[]>([])
const detailLoading = ref(false)

async function openDetail(student: Student) {
  detailStudent.value = student
  detailLoading.value = true
  try {
    detailEnrollments.value = (await studentsApi.courses(student.id, { per_page: 50 })).data
  } finally {
    detailLoading.value = false
  }
}

const enrollModalOpen = ref(false)

async function afterEnroll() {
  if (detailStudent.value) await openDetail(detailStudent.value)
  await load()
}
</script>

<template>
  <AppLayout>
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold text-foreground">دانشجویان</h1>
        <Button v-if="can('students.create')" @click="openCreate">
          <IconPlus class="size-4" />
          دانشجوی جدید
        </Button>
      </div>

      <SearchInput v-model="searchTerm" placeholder="جستجو بر اساس نام، کد ملی یا کد دانشجویی..." @update:model-value="onSearch" />

      <DataTable :columns="columns" :rows="items" :loading="loading">
        <template #cell-name="{ row }">
          <button type="button" class="text-start font-medium text-foreground hover:text-accent" @click="openDetail(row)">
            {{ row.first_name }} {{ row.last_name }}
          </button>
        </template>
        <template #cell-is_active="{ row }">
          <Badge :variant="row.is_active === false ? 'destructive' : 'success'">
            {{ row.is_active === false ? 'غیرفعال' : 'فعال' }}
          </Badge>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end gap-1">
            <button
              v-if="can('students.update')"
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              @click="openEdit(row)"
            >
              <IconPencil class="size-4" />
            </button>
            <button
              v-if="can('students.delete')"
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

    <Modal :open="modalOpen" :title="editing ? 'ویرایش دانشجو' : 'دانشجوی جدید'" @close="modalOpen = false">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div class="grid grid-cols-2 gap-4">
          <Input v-model="form.first_name" label="نام" required :error="errors.first_name" />
          <Input v-model="form.last_name" label="نام خانوادگی" required :error="errors.last_name" />
        </div>
        <Input v-model="form.father_name" label="نام پدر" />
        <Input v-model="form.national_id" label="کد ملی" required :error="errors.national_id" />
        <Input v-model="form.mobile_phone" label="موبایل" required :error="errors.mobile_phone" />
        <Input v-model="form.email" type="email" label="ایمیل" required :error="errors.email" />
        <Input v-model="form.education_level" label="مقطع تحصیلی" />
        <Input v-model="form.address" label="آدرس" />
        <Input v-model="form.postal_code" label="کد پستی" />
        <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>
        <Button type="submit" :loading="submitting" class="w-full">{{ editing ? 'ذخیره تغییرات' : 'ایجاد' }}</Button>
      </form>
    </Modal>

    <ConfirmDialog
      :open="!!deleteTarget"
      title="حذف دانشجو"
      :message="`آیا از حذف «${deleteTarget?.first_name} ${deleteTarget?.last_name}» مطمئن هستید؟`"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />

    <Drawer :open="!!detailStudent" :title="`${detailStudent?.first_name} ${detailStudent?.last_name}`" @close="detailStudent = null">
      <div v-if="detailStudent" class="flex flex-col gap-5">
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div><span class="text-muted-foreground">کد دانشجویی:</span> {{ detailStudent.student_code }}</div>
          <div><span class="text-muted-foreground">کد ملی:</span> {{ detailStudent.national_id }}</div>
          <div><span class="text-muted-foreground">موبایل:</span> {{ detailStudent.mobile_phone }}</div>
          <div><span class="text-muted-foreground">ایمیل:</span> {{ detailStudent.email }}</div>
        </div>

        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-foreground">دوره‌های ثبت‌نام شده</h3>
          <Button v-if="can('enrollments.create')" variant="secondary" @click="enrollModalOpen = true">
            <IconUserPlus class="size-4" />
            ثبت‌نام در دوره
          </Button>
        </div>

        <p v-if="detailLoading" class="text-sm text-muted-foreground">در حال بارگذاری...</p>
        <p v-else-if="detailEnrollments.length === 0" class="text-sm text-muted-foreground">دوره‌ای ثبت نشده است.</p>
        <ul v-else class="flex flex-col gap-2">
          <li v-for="enrollment in detailEnrollments" :key="enrollment.id" class="rounded-lg border border-border p-3 text-sm">
            <div class="flex items-center justify-between">
              <span class="font-medium text-foreground">{{ enrollment.course.title }}</span>
              <Badge>{{ enrollmentStatusLabels[enrollment.status] }}</Badge>
            </div>
            <div class="mt-1 text-xs text-muted-foreground">
              {{ enrollment.course.code }} — تاریخ ثبت‌نام: {{ toJalaliDisplay(enrollment.enrolled_at) }}
            </div>
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
      :preset-student-id="detailStudent?.id"
      @close="enrollModalOpen = false"
      @enrolled="afterEnroll"
    />
  </AppLayout>
</template>

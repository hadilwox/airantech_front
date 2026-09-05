<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-vue'

import { instructorsApi } from '@/api/instructors'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Column } from '@/components/ui/DataTable.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import Select from '@/components/ui/Select.vue'
import { usePaginatedResource } from '@/composables/usePaginatedResource'
import { usePermission } from '@/composables/usePermission'
import AppLayout from '@/layouts/AppLayout.vue'
import { ApiError } from '@/types/api'
import type { Instructor, InstructorPayload } from '@/types/instructors'
import { instructorStatusLabels as statusLabels, instructorStatusVariant as statusVariant } from '@/utils/labels'

const { can } = usePermission()

const { items, loading, page, lastPage, total, load, setFilter } = usePaginatedResource((params) =>
  instructorsApi.list(params),
)
load()

const columns: Column<Instructor>[] = [
  { key: 'name', label: 'نام' },
  { key: 'national_id', label: 'کد ملی' },
  { key: 'mobile_phone', label: 'موبایل' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: '', class: 'text-left' },
]

const searchTerm = ref('')
function onSearch(value: string) {
  searchTerm.value = value
  setFilter('q', value)
  load()
}

const statusFilter = ref('')
function onStatusFilter(value: string) {
  statusFilter.value = value
  setFilter('status', value || undefined)
  load()
}

const emptyForm = (): InstructorPayload => ({
  email: '',
  first_name: '',
  last_name: '',
  father_name: '',
  national_id: '',
  residence: '',
  marital_status: '',
  date_of_birth: null,
  mobile_phone: '',
  landline_phone: '',
  emergency_phone: '',
  education_degree: '',
  skills: '',
  work_experience: '',
})

const modalOpen = ref(false)
const editing = ref<Instructor | null>(null)
const form = reactive<InstructorPayload>(emptyForm())
const errors = reactive<Partial<Record<keyof InstructorPayload, string>>>({})
const submitting = ref(false)
const generalError = ref('')

function openCreate() {
  editing.value = null
  Object.assign(form, emptyForm())
  clearErrors()
  modalOpen.value = true
}

function openEdit(instructor: Instructor) {
  editing.value = instructor
  Object.assign(form, {
    email: instructor.email ?? '',
    first_name: instructor.first_name,
    last_name: instructor.last_name,
    father_name: instructor.father_name ?? '',
    national_id: instructor.national_id,
    residence: instructor.residence ?? '',
    marital_status: instructor.marital_status ?? '',
    date_of_birth: instructor.date_of_birth,
    mobile_phone: instructor.mobile_phone,
    landline_phone: instructor.landline_phone ?? '',
    emergency_phone: instructor.emergency_phone ?? '',
    education_degree: instructor.education_degree ?? '',
    skills: instructor.skills ?? '',
    work_experience: instructor.work_experience ?? '',
    status: instructor.status,
  })
  clearErrors()
  modalOpen.value = true
}

function clearErrors() {
  generalError.value = ''
  for (const key of Object.keys(errors) as (keyof InstructorPayload)[]) errors[key] = undefined
}

async function submit() {
  clearErrors()
  submitting.value = true

  try {
    if (editing.value) {
      await instructorsApi.update(editing.value.id, form)
    } else {
      await instructorsApi.create(form)
    }
    modalOpen.value = false
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.status === 422 && error.errors) {
      for (const field of Object.keys(error.errors)) {
        errors[field as keyof InstructorPayload] = error.fieldError(field)
      }
    } else if (error instanceof ApiError) {
      generalError.value = error.message
    }
  } finally {
    submitting.value = false
  }
}

const deleteTarget = ref<Instructor | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await instructorsApi.remove(deleteTarget.value.id)
    deleteTarget.value = null
    await load()
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold text-foreground">مدرسین</h1>
        <Button v-if="can('instructors.create')" @click="openCreate">
          <IconPlus class="size-4" />
          مدرس جدید
        </Button>
      </div>

      <div class="flex gap-3">
        <SearchInput v-model="searchTerm" placeholder="جستجو بر اساس نام یا کد ملی..." class="flex-1" @update:model-value="onSearch" />
        <select
          :value="statusFilter"
          class="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          @change="onStatusFilter(($event.target as HTMLSelectElement).value)"
        >
          <option value="">همه وضعیت‌ها</option>
          <option v-for="(label, value) in statusLabels" :key="value" :value="value">{{ label }}</option>
        </select>
      </div>

      <DataTable :columns="columns" :rows="items" :loading="loading">
        <template #cell-name="{ row }">{{ row.first_name }} {{ row.last_name }}</template>
        <template #cell-status="{ row }">
          <Badge :variant="statusVariant[row.status]">{{ statusLabels[row.status] }}</Badge>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end gap-1">
            <button
              v-if="can('instructors.update')"
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              @click="openEdit(row)"
            >
              <IconPencil class="size-4" />
            </button>
            <button
              v-if="can('instructors.delete')"
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

    <Modal :open="modalOpen" :title="editing ? 'ویرایش مدرس' : 'مدرس جدید'" @close="modalOpen = false">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <div class="grid grid-cols-2 gap-4">
          <Input v-model="form.first_name" label="نام" required :error="errors.first_name" />
          <Input v-model="form.last_name" label="نام خانوادگی" required :error="errors.last_name" />
        </div>
        <Input v-model="form.national_id" label="کد ملی" required :error="errors.national_id" />
        <Input v-model="form.mobile_phone" label="موبایل" required :error="errors.mobile_phone" />
        <Input v-model="form.email" type="email" label="ایمیل" required :error="errors.email" />
        <Input v-model="form.education_degree" label="مدرک تحصیلی" />
        <Input v-model="form.skills" label="مهارت‌ها" />
        <Select
          v-if="editing && can('instructors.update')"
          v-model="form.status"
          label="وضعیت"
          :options="Object.entries(statusLabels).map(([value, label]) => ({ value, label }))"
        />
        <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>
        <Button type="submit" :loading="submitting" class="w-full">{{ editing ? 'ذخیره تغییرات' : 'ایجاد' }}</Button>
      </form>
    </Modal>

    <ConfirmDialog
      :open="!!deleteTarget"
      title="حذف مدرس"
      :message="`آیا از حذف «${deleteTarget?.first_name} ${deleteTarget?.last_name}» مطمئن هستید؟`"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </AppLayout>
</template>

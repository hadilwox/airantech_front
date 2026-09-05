<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IconPencil, IconTrash } from '@tabler/icons-vue'

import { enrollmentsApi } from '@/api/enrollments'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Column } from '@/components/ui/DataTable.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Select from '@/components/ui/Select.vue'
import { usePaginatedResource } from '@/composables/usePaginatedResource'
import { usePermission } from '@/composables/usePermission'
import AppLayout from '@/layouts/AppLayout.vue'
import { ApiError } from '@/types/api'
import type { Enrollment, EnrollmentUpdatePayload } from '@/types/enrollments'
import { formatToman } from '@/utils/format'
import {
  enrollmentPaymentLabels as paymentLabels,
  enrollmentPaymentVariant as paymentVariant,
  enrollmentStatusLabels as statusLabels,
} from '@/utils/labels'

const { can } = usePermission()

const { items, loading, page, lastPage, total, load, setFilter } = usePaginatedResource((params) =>
  enrollmentsApi.list(params),
)
load()

const columns: Column<Enrollment>[] = [
  { key: 'student', label: 'دانشجو' },
  { key: 'course', label: 'دوره' },
  { key: 'tuition_amount', label: 'شهریه' },
  { key: 'payment_status', label: 'وضعیت پرداخت' },
  { key: 'status', label: 'وضعیت ثبت‌نام' },
  { key: 'actions', label: '', class: 'text-left' },
]

const statusFilter = ref('')
function onStatusFilter(value: string) {
  statusFilter.value = value
  setFilter('status', value || undefined)
  load()
}

const modalOpen = ref(false)
const editing = ref<Enrollment | null>(null)
const form = reactive<EnrollmentUpdatePayload>({})
const errors = reactive<Partial<Record<keyof EnrollmentUpdatePayload, string>>>({})
const submitting = ref(false)
const generalError = ref('')

function openEdit(enrollment: Enrollment) {
  editing.value = enrollment
  form.status = enrollment.status
  form.paid_amount = Number(enrollment.paid_amount)
  form.notes = enrollment.notes ?? ''
  generalError.value = ''
  errors.paid_amount = undefined
  modalOpen.value = true
}

async function submit() {
  if (!editing.value) return
  generalError.value = ''
  errors.paid_amount = undefined
  submitting.value = true

  try {
    await enrollmentsApi.update(editing.value.id, form)
    modalOpen.value = false
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      errors.paid_amount = error.fieldError('paid_amount')
    } else if (error instanceof ApiError) {
      generalError.value = error.message
    }
  } finally {
    submitting.value = false
  }
}

const deleteTarget = ref<Enrollment | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await enrollmentsApi.remove(deleteTarget.value.id)
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
        <h1 class="text-lg font-bold text-foreground">ثبت‌نام‌ها</h1>
      </div>

      <select
        :value="statusFilter"
        class="w-fit rounded-lg border border-border bg-card px-3 py-2 text-sm"
        @change="onStatusFilter(($event.target as HTMLSelectElement).value)"
      >
        <option value="">همه وضعیت‌ها</option>
        <option v-for="(label, value) in statusLabels" :key="value" :value="value">{{ label }}</option>
      </select>

      <DataTable :columns="columns" :rows="items" :loading="loading">
        <template #cell-student="{ row }">{{ row.student.first_name }} {{ row.student.last_name }}</template>
        <template #cell-course="{ row }">{{ row.course.title }} ({{ row.course.code }})</template>
        <template #cell-tuition_amount="{ row }">{{ formatToman(row.tuition_amount) }}</template>
        <template #cell-payment_status="{ row }">
          <Badge :variant="paymentVariant[row.payment_status]">{{ paymentLabels[row.payment_status] }}</Badge>
        </template>
        <template #cell-status="{ row }">
          <Badge>{{ statusLabels[row.status] }}</Badge>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end gap-1">
            <button
              v-if="can('enrollments.update')"
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              @click="openEdit(row)"
            >
              <IconPencil class="size-4" />
            </button>
            <button
              v-if="can('enrollments.delete')"
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

    <Modal :open="modalOpen" title="ویرایش ثبت‌نام" @close="modalOpen = false">
      <form v-if="editing" class="flex flex-col gap-4" @submit.prevent="submit">
        <div class="rounded-lg bg-muted p-3 text-sm">
          <div>{{ editing.student.first_name }} {{ editing.student.last_name }} — {{ editing.course.title }}</div>
          <div class="mt-1 text-muted-foreground">شهریه کل: {{ formatToman(editing.tuition_amount) }}</div>
        </div>

        <Select
          v-model="form.status"
          label="وضعیت ثبت‌نام"
          :options="Object.entries(statusLabels).map(([value, label]) => ({ value, label }))"
        />

        <label class="flex flex-col gap-1.5 text-sm font-medium text-foreground">
          مبلغ پرداخت‌شده (تومان)
          <input
            v-model.number="form.paid_amount"
            type="number"
            class="rounded-lg border px-3 py-2 text-sm"
            :class="errors.paid_amount ? 'border-destructive' : 'border-border'"
          />
          <span v-if="errors.paid_amount" class="text-xs text-destructive">{{ errors.paid_amount }}</span>
        </label>

        <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>

        <Button type="submit" :loading="submitting" class="w-full">ذخیره تغییرات</Button>
      </form>
    </Modal>

    <ConfirmDialog
      :open="!!deleteTarget"
      title="حذف ثبت‌نام"
      message="آیا از حذف این ثبت‌نام مطمئن هستید؟"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </AppLayout>
</template>

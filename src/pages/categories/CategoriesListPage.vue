<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-vue'

import { categoriesApi } from '@/api/categories'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import type { Column } from '@/components/ui/DataTable.vue'
import DataTable from '@/components/ui/DataTable.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'
import SearchInput from '@/components/ui/SearchInput.vue'
import { usePaginatedResource } from '@/composables/usePaginatedResource'
import { usePermission } from '@/composables/usePermission'
import AppLayout from '@/layouts/AppLayout.vue'
import { ApiError } from '@/types/api'
import type { CourseCategory, CourseCategoryPayload } from '@/types/categories'

const { can } = usePermission()

const { items, loading, page, lastPage, total, load, setFilter } = usePaginatedResource((params) =>
  categoriesApi.list(params),
)
load()

const columns: Column<CourseCategory>[] = [
  { key: 'name', label: 'نام' },
  { key: 'code_prefix', label: 'پیشوند کد' },
  { key: 'courses_count', label: 'تعداد دوره‌ها' },
  { key: 'is_active', label: 'وضعیت' },
  { key: 'actions', label: '', class: 'text-left' },
]

const searchTerm = ref('')
function onSearch(value: string) {
  searchTerm.value = value
  setFilter('q', value)
  load()
}

const modalOpen = ref(false)
const editing = ref<CourseCategory | null>(null)
const form = reactive<CourseCategoryPayload>({ name: '', code_prefix: '', is_active: true })
const errors = reactive<Partial<Record<keyof CourseCategoryPayload, string>>>({})
const submitting = ref(false)
const generalError = ref('')

function openCreate() {
  editing.value = null
  form.name = ''
  form.code_prefix = ''
  form.is_active = true
  clearErrors()
  modalOpen.value = true
}

function openEdit(category: CourseCategory) {
  editing.value = category
  form.name = category.name
  form.code_prefix = category.code_prefix
  form.is_active = category.is_active
  clearErrors()
  modalOpen.value = true
}

function clearErrors() {
  generalError.value = ''
  errors.name = undefined
  errors.code_prefix = undefined
}

async function submit() {
  clearErrors()
  submitting.value = true

  try {
    if (editing.value) {
      await categoriesApi.update(editing.value.id, form)
    } else {
      await categoriesApi.create(form)
    }
    modalOpen.value = false
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      errors.name = error.fieldError('name')
      errors.code_prefix = error.fieldError('code_prefix')
    } else if (error instanceof ApiError) {
      generalError.value = error.message
    }
  } finally {
    submitting.value = false
  }
}

const deleteTarget = ref<CourseCategory | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await categoriesApi.remove(deleteTarget.value.id)
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
        <h1 class="text-lg font-bold text-foreground">دسته‌بندی دوره‌ها</h1>
        <Button v-if="can('categories.create')" @click="openCreate">
          <IconPlus class="size-4" />
          دسته‌بندی جدید
        </Button>
      </div>

      <SearchInput v-model="searchTerm" placeholder="جستجوی دسته‌بندی..." @update:model-value="onSearch" />

      <DataTable :columns="columns" :rows="items" :loading="loading">
        <template #cell-is_active="{ row }">
          <Badge :variant="row.is_active ? 'success' : 'default'">{{ row.is_active ? 'فعال' : 'غیرفعال' }}</Badge>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end gap-1">
            <button
              v-if="can('categories.update')"
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              @click="openEdit(row)"
            >
              <IconPencil class="size-4" />
            </button>
            <button
              v-if="can('categories.delete')"
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

    <Modal :open="modalOpen" :title="editing ? 'ویرایش دسته‌بندی' : 'دسته‌بندی جدید'" @close="modalOpen = false">
      <form class="flex flex-col gap-4" @submit.prevent="submit">
        <Input v-model="form.name" label="نام دسته‌بندی" required :error="errors.name" />
        <Input v-model="form.code_prefix" label="پیشوند کد (مثلاً 3)" required :error="errors.code_prefix" />
        <label class="flex items-center gap-2 text-sm text-foreground">
          <input v-model="form.is_active" type="checkbox" class="size-4 rounded border-border" />
          فعال
        </label>
        <p v-if="generalError" class="text-sm text-destructive">{{ generalError }}</p>
        <Button type="submit" :loading="submitting" class="w-full">{{ editing ? 'ذخیره تغییرات' : 'ایجاد' }}</Button>
      </form>
    </Modal>

    <ConfirmDialog
      :open="!!deleteTarget"
      title="حذف دسته‌بندی"
      :message="`آیا از حذف دسته‌بندی «${deleteTarget?.name}» مطمئن هستید؟`"
      :loading="deleting"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </AppLayout>
</template>

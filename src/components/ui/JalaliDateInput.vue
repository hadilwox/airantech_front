<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { daysInJalaliMonth, gregorianFromJalali, jalaliFromIso, PERSIAN_MONTH_NAMES, toPersianDigits } from '@/utils/jalali'

const props = withDefaults(
  defineProps<{ modelValue: string | null | undefined; label?: string; required?: boolean }>(),
  { required: false },
)
const emit = defineEmits<{ 'update:modelValue': [value: string | null] }>()

const currentJalaliYear = jalaliFromIso(new Date().toISOString().slice(0, 10))!.jy

const initial = jalaliFromIso(props.modelValue)
const year = ref<number | null>(initial?.jy ?? null)
const month = ref<number | null>(initial?.jm ?? null)
const day = ref<number | null>(initial?.jd ?? null)

const years = Array.from({ length: 100 }, (_, i) => currentJalaliYear - i)
const months = PERSIAN_MONTH_NAMES.map((name, index) => ({ value: index + 1, label: name }))
const days = computed(() => {
  const count = year.value && month.value ? daysInJalaliMonth(year.value, month.value) : 31
  return Array.from({ length: count }, (_, i) => i + 1)
})

watch([year, month, day], ([y, m, d]) => {
  if (y && m && d) {
    emit('update:modelValue', gregorianFromJalali(y, m, d))
  } else {
    emit('update:modelValue', null)
  }
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-sm font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </label>
    <div class="grid grid-cols-3 gap-2">
      <select v-model="day" class="rounded-lg border border-border bg-card px-2 py-2 text-sm text-card-foreground">
        <option :value="null" disabled>روز</option>
        <option v-for="d in days" :key="d" :value="d">{{ toPersianDigits(d) }}</option>
      </select>
      <select v-model="month" class="rounded-lg border border-border bg-card px-2 py-2 text-sm text-card-foreground">
        <option :value="null" disabled>ماه</option>
        <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
      </select>
      <select v-model="year" class="rounded-lg border border-border bg-card px-2 py-2 text-sm text-card-foreground">
        <option :value="null" disabled>سال</option>
        <option v-for="y in years" :key="y" :value="y">{{ toPersianDigits(y) }}</option>
      </select>
    </div>
  </div>
</template>

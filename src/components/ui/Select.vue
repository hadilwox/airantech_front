<script setup lang="ts">
export interface SelectOption {
  value: string | number
  label: string
}

withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    options: SelectOption[]
    label?: string
    placeholder?: string
    error?: string
    required?: boolean
    disabled?: boolean
  }>(),
  { required: false, disabled: false },
)

defineEmits<{ 'update:modelValue': [value: string] }>()

const id = `field-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue ?? ''"
      :disabled="disabled"
      class="rounded-lg border bg-card px-3 py-2 text-sm text-card-foreground outline-none transition focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
      :class="error ? 'border-destructive' : 'border-border'"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled>{{ placeholder ?? 'انتخاب کنید' }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: string | number | null | undefined
    label?: string
    type?: string
    placeholder?: string
    error?: string
    required?: boolean
  }>(),
  {
    type: 'text',
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const id = `field-${Math.random().toString(36).slice(2, 9)}`

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  emit('update:modelValue', props.type === 'number' ? Number(raw) : raw)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="id" class="text-sm font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :aria-invalid="!!error"
      class="rounded-lg border bg-card px-3 py-2 text-sm text-card-foreground outline-none transition focus:ring-2 focus:ring-ring"
      :class="error ? 'border-destructive' : 'border-border'"
      @input="onInput"
    />
    <p v-if="error" class="text-xs text-destructive">{{ error }}</p>
  </div>
</template>

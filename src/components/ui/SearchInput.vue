<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconSearch } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{ modelValue: string; placeholder?: string; debounceMs?: number }>(), {
  placeholder: 'جستجو...',
  debounceMs: 350,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const local = ref(props.modelValue)
let timer: ReturnType<typeof setTimeout> | undefined

watch(local, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => emit('update:modelValue', value), props.debounceMs)
})

watch(
  () => props.modelValue,
  (value) => {
    if (value !== local.value) local.value = value
  },
)
</script>

<template>
  <div class="relative">
    <IconSearch class="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
    <input
      v-model="local"
      type="text"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-border bg-card ps-9 pe-3 py-2 text-sm text-card-foreground outline-none transition focus:ring-2 focus:ring-ring"
    />
  </div>
</template>

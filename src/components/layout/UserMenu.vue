<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { IconChevronDown, IconLogout } from '@tabler/icons-vue'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const open = ref(false)

async function handleLogout() {
  open.value = false
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground transition hover:bg-muted"
      @click="open = !open"
    >
      <span
        class="flex size-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
      >
        {{ auth.user?.name?.charAt(0) }}
      </span>
      <span class="hidden sm:inline">{{ auth.user?.name }}</span>
      <IconChevronDown class="size-4 text-muted-foreground" />
    </button>

    <div
      v-if="open"
      class="absolute end-0 z-10 mt-2 w-48 rounded-lg border border-border bg-card p-1 shadow-lg"
    >
      <button
        type="button"
        class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition hover:bg-muted"
        @click="handleLogout"
      >
        <IconLogout class="size-4" />
        خروج از حساب
      </button>
    </div>
  </div>
</template>

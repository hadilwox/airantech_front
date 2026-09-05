import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'academy-theme'

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(readStoredTheme() ?? (systemPrefersDark() ? 'dark' : 'light'))

  watchEffect(() => {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')

    try {
      localStorage.setItem(STORAGE_KEY, theme.value)
    } catch {
      // Private browsing / storage disabled — theme just won't persist across visits.
    }
  })

  function toggle(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function set(value: Theme): void {
    theme.value = value
  }

  return { theme, toggle, set }
})

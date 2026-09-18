import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useTheme } from 'vuetify'

export type ColorScheme = 'light' | 'dark'

export const COLOR_SCHEME_KEY = 'rocket-catalog:color-scheme'

const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)'

function readStored (): ColorScheme | null {
  try {
    const stored = window.localStorage.getItem(COLOR_SCHEME_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function persist (scheme: ColorScheme) {
  try {
    window.localStorage.setItem(COLOR_SCHEME_KEY, scheme)
  } catch {
    return
  }
}

function systemPrefersDark (): boolean {
  return window.matchMedia(SYSTEM_DARK_QUERY).matches
}

function initialDark (): boolean {
  const stored = readStored()
  return stored ? stored === 'dark' : systemPrefersDark()
}

const isDark = ref(initialDark())

export function useColorScheme () {
  const theme = useTheme()
  const media = window.matchMedia(SYSTEM_DARK_QUERY)

  watch(isDark, value => {
    theme.global.name.value = value ? 'dark' : 'light'
  }, { immediate: true })

  function set (scheme: ColorScheme) {
    isDark.value = scheme === 'dark'
    persist(scheme)
  }

  function toggle () {
    set(isDark.value ? 'light' : 'dark')
  }

  function followSystem (event: MediaQueryListEvent) {
    if (!readStored()) {
      isDark.value = event.matches
    }
  }

  onMounted(() => {
    media.addEventListener('change', followSystem)
  })

  onUnmounted(() => {
    media.removeEventListener('change', followSystem)
  })

  return {
    isDark: computed(() => isDark.value),
    set,
    toggle,
  }
}

<template>
  <v-app-bar
    border
    class="app-header"
    flat
  >
    <div class="app-header__inner">
      <router-link
        class="app-header__brand"
        to="/"
      >
        SpaceX rocket catalog
      </router-link>

      <v-spacer />

      <v-btn
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        variant="text"
        @click="toggle"
      />
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useColorScheme } from '@/composables/useColorScheme'

const { isDark, toggle } = useColorScheme()
</script>

<style scoped>
.app-header__inner {
  align-items: center;
  display: flex;
  gap: var(--space-3);
  margin: 0 auto;
  max-width: 1140px;
  padding: 0 var(--shell-gutter);
  width: 100%;
}

.app-header__brand {
  color: rgb(var(--v-theme-on-surface));
  font-size: var(--font-title);
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
}

.app-header__brand:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 4px;
}
</style>

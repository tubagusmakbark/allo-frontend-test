<template>
  <v-app>
    <a
      class="skip-link"
      href="#main-content"
    >
      Skip to content
    </a>

    <AppHeader />

    <v-main
      id="main-content"
      tabindex="-1"
    >
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

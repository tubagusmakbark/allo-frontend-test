<template>
  <div
    class="request-state surface-panel panel-pad"
    :aria-live="status === 'loading' ? 'polite' : 'assertive'"
    :role="status === 'loading' ? 'status' : 'alert'"
  >
    <v-progress-circular
      v-if="status === 'loading'"
      aria-hidden="true"
      color="primary"
      indeterminate
      :size="32"
      :width="3"
    />

    <div class="request-state__copy">
      <p class="request-state__title">
        {{ title }}
      </p>
      <p
        v-if="body"
        class="request-state__body text-muted measure"
      >
        {{ body }}
      </p>
    </div>

    <v-btn
      v-if="status === 'failed'"
      color="primary"
      variant="flat"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  body: string | null
  status: 'loading' | 'failed'
  title: string
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped>
.request-state {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-bottom: var(--space-7);
  padding-top: var(--space-7);
  text-align: center;
}

.request-state__copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.request-state__title {
  font-size: var(--font-title);
  font-weight: 600;
  margin: 0;
}

.request-state__body {
  margin: 0 auto;
}
</style>

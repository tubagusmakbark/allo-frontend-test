<template>
  <div
    class="rocket-image"
    :class="{ 'rocket-image--tall': tall }"
  >
    <img
      v-if="source && !hasFailed"
      class="rocket-image__picture"
      :alt="`${name} rocket`"
      loading="lazy"
      :src="source"
      @error="hasFailed = true"
    >
    <p
      v-else
      class="rocket-image__placeholder"
    >
      No image recorded
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  name: string
  source: string | null
  tall?: boolean
}>(), {
  tall: false,
})

const hasFailed = ref(false)

watch(() => props.source, () => {
  hasFailed.value = false
})
</script>

<style scoped>
.rocket-image {
  align-items: center;
  aspect-ratio: 16 / 10;
  background: rgb(var(--v-theme-surface-variant));
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.rocket-image--tall {
  aspect-ratio: 4 / 3;
}

.rocket-image__picture {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.rocket-image__placeholder {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: var(--font-label);
  letter-spacing: 0.01em;
  margin: 0;
  padding: var(--space-3);
  text-align: center;
}
</style>

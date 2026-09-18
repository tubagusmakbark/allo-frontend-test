<template>
  <v-card
    class="rocket-card"
    flat
    link
    :aria-labelledby="titleId"
    :to="`/rockets/${rocket.id}`"
  >
    <RocketImage
      :name="rocket.name"
      :source="rocket.imageUrl"
    />

    <div class="rocket-card__head">
      <h3
        :id="titleId"
        class="rocket-card__name"
      >
        {{ rocket.name }}
      </h3>
      <p
        v-if="rocket.family || rocket.countryCode"
        class="rocket-card__meta text-muted"
      >
        {{ [rocket.family, rocket.countryCode].filter(Boolean).join(' · ') }}
      </p>
    </div>

    <p class="rocket-card__body">
      <span v-if="rocket.description">{{ rocket.description }}</span>
      <span
        v-else
        class="text-muted"
      >No description recorded for this rocket.</span>
    </p>

    <div
      v-if="rocket.addedLocally"
      class="rocket-card__foot"
    >
      <v-chip
        label
        size="small"
        variant="outlined"
      >
        Added by you
      </v-chip>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import RocketImage from '@/components/RocketImage.vue'
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()

const titleId = useId()
</script>

<style scoped>
.rocket-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition:
    border-color var(--motion-base) var(--ease-standard),
    box-shadow var(--motion-base) var(--ease-standard),
    transform var(--motion-base) var(--ease-standard);
}

.rocket-card:hover {
  border-color: rgba(var(--v-border-color), 0.28);
  box-shadow: var(--shadow-hover);
}

.rocket-card__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-4) var(--space-2);
}

.rocket-card__name {
  font-size: var(--font-title);
  font-weight: 600;
  line-height: var(--leading-snug);
  margin: 0;
}

.rocket-card__meta {
  font-size: var(--font-label);
  letter-spacing: 0.01em;
  margin: 0;
}

.rocket-card__body {
  display: -webkit-box;
  flex-grow: 1;
  font-size: var(--font-body);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
  padding: 0 var(--space-4);
}

.rocket-card__foot {
  padding: var(--space-3) var(--space-4) var(--space-4);
}
</style>

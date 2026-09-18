<template>
  <v-card
    aria-hidden="true"
    class="rocket-skeleton"
    flat
  >
    <div class="skeleton-block rocket-skeleton__media" />

    <div class="rocket-skeleton__head">
      <div class="skeleton-block rocket-skeleton__title" />
      <div class="skeleton-block rocket-skeleton__meta" />
    </div>

    <div class="rocket-skeleton__body">
      <div class="skeleton-block rocket-skeleton__line" />
      <div class="skeleton-block rocket-skeleton__line" />
      <div class="skeleton-block rocket-skeleton__line rocket-skeleton__line--short" />
    </div>
  </v-card>
</template>

<style scoped>
.rocket-skeleton {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.rocket-skeleton__media {
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-card) var(--radius-card) 0 0;
}

.rocket-skeleton__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-4) var(--space-2);
}

.rocket-skeleton__title {
  height: 1.0625rem;
  width: 62%;
}

.rocket-skeleton__meta {
  height: 0.75rem;
  width: 34%;
}

.rocket-skeleton__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: 0 var(--space-4) var(--space-5);
}

.rocket-skeleton__line {
  height: 0.6875rem;
}

.rocket-skeleton__line--short {
  width: 72%;
}
</style>

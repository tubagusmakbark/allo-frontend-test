<template>
  <div class="shell rocket-detail">
    <v-btn
      class="rocket-detail__back"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to all rockets
    </v-btn>

    <div
      v-if="isLoading"
      aria-live="polite"
      class="rocket-detail__grid"
      role="status"
    >
      <span class="visually-hidden">Loading this rocket from Launch Library 2.</span>
      <div class="skeleton-block rocket-detail__skeleton-media" />
      <div class="rocket-detail__skeleton-panel">
        <div
          v-for="slot in 3"
          :key="slot"
          class="skeleton-block rocket-detail__skeleton-row"
        />
        <div class="skeleton-block rocket-detail__skeleton-line" />
        <div class="skeleton-block rocket-detail__skeleton-line" />
        <div class="skeleton-block rocket-detail__skeleton-line rocket-detail__skeleton-line--short" />
      </div>
    </div>

    <RequestState
      v-else-if="requestState"
      :body="requestState.body"
      :status="requestState.status"
      :title="requestState.title"
      @retry="resolveRocket"
    />

    <div
      v-else-if="missing"
      class="rocket-detail__empty surface-panel panel-pad"
    >
      <h1 class="rocket-detail__empty-title">
        {{ missingTitle }}
      </h1>
      <p class="rocket-detail__empty-body text-muted">
        {{ missingBody }}
      </p>
      <v-btn
        color="primary"
        to="/"
        variant="flat"
      >
        Browse the catalog
      </v-btn>
    </div>

    <template v-else-if="rocket">
      <header class="rocket-detail__header">
        <h1 class="rocket-detail__title text-display">
          {{ rocket.name }}
        </h1>
        <p
          v-if="rocket.family || rocket.countryCode"
          class="rocket-detail__subtitle text-muted"
        >
          {{ [rocket.family, rocket.countryCode].filter(Boolean).join(' · ') }}
        </p>
      </header>

      <div class="rocket-detail__grid">
        <div class="rocket-detail__figure surface-panel">
          <RocketImage
            :name="rocket.name"
            :source="rocket.imageUrl"
            tall
          />
        </div>

        <div class="rocket-detail__panel">
          <dl class="rocket-facts">
            <div
              v-for="fact in facts"
              :key="fact.label"
              class="rocket-facts__row"
            >
              <dt class="rocket-facts__label text-muted">
                {{ fact.label }}
              </dt>
              <dd
                class="rocket-facts__value"
                :class="{ 'text-muted': !fact.value }"
              >
                {{ fact.value ?? NOT_RECORDED }}
              </dd>
            </div>
          </dl>

          <p class="rocket-detail__description measure">
            {{ rocket.description ?? 'No description recorded for this rocket.' }}
          </p>

          <v-chip
            v-if="rocket.addedLocally"
            label
            size="small"
            variant="outlined"
          >
            Added by you
          </v-chip>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import RequestState from '@/components/RequestState.vue'
import RocketImage from '@/components/RocketImage.vue'
import { fetchRocket, RocketRequestError } from '@/services/launchLibrary'
import { useRocketsStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'
import { formatFlightDate, formatLaunchCost, NOT_RECORDED } from '@/utils/rocketFormat'

const route = useRoute('/rockets/[id]')
const store = useRocketsStore()

const rocket = ref<Rocket | null>(null)
const status = ref<'idle' | 'loading' | 'ready' | 'failed'>('idle')
const errorMessage = ref<string | null>(null)
const missing = ref(false)

const rocketId = computed(() => Number(route.params.id))

const isLoading = computed(() => status.value === 'loading')

const facts = computed(() => [
  { label: 'Cost per launch', value: formatLaunchCost(rocket.value?.launchCost ?? null) },
  { label: 'Country', value: rocket.value?.countryCode ?? null },
  { label: 'First flight', value: formatFlightDate(rocket.value?.maidenFlight ?? null) },
])

const requestState = computed<{ body: string | null, status: 'failed', title: string } | null>(() => {
  if (status.value !== 'failed') {
    return null
  }
  return {
    body: errorMessage.value,
    status: 'failed',
    title: 'This rocket could not be loaded',
  }
})

const missingTitle = computed(() => rocketId.value < 0
  ? 'That rocket is no longer in this session'
  : 'No rocket with that id')

const missingBody = computed(() => rocketId.value < 0
  ? 'Rockets added in this app live in the browser session only, and a page reload clears them.'
  : 'Launch Library 2 has no rocket with that id. It may have been removed from the catalog.')

async function resolveRocket () {
  const id = rocketId.value

  if (!Number.isInteger(id) || id === 0) {
    missing.value = true
    status.value = 'ready'
    return
  }

  const cached = store.findRocket(id)
  if (cached) {
    rocket.value = cached
    missing.value = false
    status.value = 'ready'
    return
  }

  if (id < 0) {
    rocket.value = null
    missing.value = true
    status.value = 'ready'
    return
  }

  status.value = 'loading'
  errorMessage.value = null

  try {
    const loaded = await fetchRocket(id)
    rocket.value = loaded
    store.cacheRocket(loaded)
    missing.value = false
    status.value = 'ready'
  } catch (error) {
    if (error instanceof RocketRequestError && error.notFound) {
      rocket.value = null
      missing.value = true
      status.value = 'ready'
      return
    }
    status.value = 'failed'
    errorMessage.value = error instanceof Error
      ? error.message
      : 'The rocket could not be loaded.'
  }
}

onMounted(resolveRocket)

watch(rocketId, () => {
  rocket.value = null
  missing.value = false
  resolveRocket()
})
</script>

<style scoped>
.rocket-detail__back {
  margin-bottom: var(--space-4);
  margin-left: calc(var(--space-3) * -1);
}

.rocket-detail__header {
  margin-bottom: var(--space-5);
}

.rocket-detail__title {
  margin: 0 0 var(--space-2);
}

.rocket-detail__subtitle {
  font-size: var(--font-body);
  margin: 0;
}

.rocket-detail__grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: 1fr;
}

.rocket-detail__figure {
  overflow: hidden;
}

.rocket-facts {
  margin: 0 0 var(--space-5);
}

.rocket-facts__row {
  align-items: baseline;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  justify-content: space-between;
  padding: var(--space-3) 0;
}

.rocket-facts__row:first-child {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.rocket-facts__label {
  font-size: var(--font-label);
  letter-spacing: 0.01em;
  margin: 0;
}

.rocket-facts__value {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  margin: 0;
  text-align: right;
}

.rocket-detail__description {
  line-height: var(--leading-body);
  margin: 0 0 var(--space-4);
}

.rocket-detail__empty {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-bottom: var(--space-7);
  padding-top: var(--space-7);
  text-align: center;
}

.rocket-detail__empty-title {
  font-size: var(--font-display);
  font-weight: 600;
  margin: 0;
}

.rocket-detail__empty-body {
  margin: 0 auto var(--space-2);
  max-width: 52ch;
}

.rocket-detail__empty .v-btn {
  align-self: center;
}

.rocket-detail__skeleton-media {
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-card);
}

.rocket-detail__skeleton-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.rocket-detail__skeleton-row {
  height: 1.25rem;
}

.rocket-detail__skeleton-line {
  height: 0.75rem;
}

.rocket-detail__skeleton-line--short {
  width: 70%;
}

@media (min-width: 960px) {
  .rocket-detail__grid {
    align-items: start;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }

  .rocket-detail__skeleton-panel {
    padding-top: var(--space-2);
  }
}
</style>

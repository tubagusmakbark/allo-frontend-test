<template>
  <div class="shell rocket-list">
    <section class="rocket-list__intro">
      <div class="rocket-list__heading">
        <h1 class="rocket-list__title text-display">
          SpaceX rockets
        </h1>
        <p class="rocket-list__lede text-muted measure">
          Every SpaceX launcher in the Launch Library 2 catalog, with the description, cost, country and first flight recorded for each one.
        </p>
      </div>

      <v-btn
        color="primary"
        variant="flat"
        @click="addDialogOpen = true"
      >
        Add rocket
      </v-btn>
    </section>

    <RocketFilters
      v-model:family="store.familyFilter"
      v-model:search="store.searchTerm"
      :all-families-value="store.ALL_FAMILIES"
      :families="store.families"
      @reset="store.resetFilters()"
    />

    <p
      v-if="store.status === 'ready'"
      class="rocket-list__count text-muted"
    >
      Showing {{ store.filteredRockets.length }} of {{ store.rockets.length }} rockets
    </p>

    <div
      v-if="isLoading"
      aria-live="polite"
      class="rocket-list__grid"
      role="status"
    >
      <span class="visually-hidden">Loading rockets from Launch Library 2.</span>
      <RocketCardSkeleton
        v-for="slot in skeletonSlots"
        :key="slot"
      />
    </div>

    <RequestState
      v-else-if="requestState"
      :body="requestState.body"
      :status="requestState.status"
      :title="requestState.title"
      @retry="store.loadRockets()"
    />

    <div
      v-else-if="store.filteredRockets.length"
      class="rocket-list__grid"
    >
      <RocketCard
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>

    <div
      v-else
      class="rocket-list__empty surface-panel panel-pad"
    >
      <h2 class="rocket-list__empty-title">
        {{ store.hasActiveFilters ? 'No rockets match this filter' : 'The catalog returned no rockets' }}
      </h2>
      <p class="rocket-list__empty-body text-muted">
        {{ emptyMessage }}
      </p>
      <v-btn
        v-if="store.hasActiveFilters"
        variant="tonal"
        @click="store.resetFilters()"
      >
        Clear filters
      </v-btn>
      <v-btn
        v-else
        variant="tonal"
        @click="store.loadRockets()"
      >
        Load the catalog again
      </v-btn>
    </div>

    <AddRocketDialog
      v-model="addDialogOpen"
      :families="store.families"
      @add="handleAdd"
    />

    <v-snackbar
      v-model="snackbarOpen"
      :timeout="4000"
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbarOpen = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import RequestState from '@/components/RequestState.vue'
import RocketCard from '@/components/RocketCard.vue'
import RocketCardSkeleton from '@/components/RocketCardSkeleton.vue'
import RocketFilters from '@/components/RocketFilters.vue'
import { useRocketsStore } from '@/stores/rockets'
import type { RocketDraft } from '@/types/rocket'

const store = useRocketsStore()

const addDialogOpen = ref(false)
const snackbarOpen = ref(false)
const snackbarMessage = ref('')
const skeletonSlots = 6

const isLoading = computed(() => store.status === 'loading')

const requestState = computed<{ body: string | null, status: 'failed', title: string } | null>(() => {
  if (store.status !== 'failed') {
    return null
  }
  return {
    body: store.errorMessage,
    status: 'failed',
    title: 'Rockets could not be loaded',
  }
})

const emptyMessage = computed(() => store.hasActiveFilters
  ? 'Nothing in the catalog matches the current search and family. Clear the filters to see every rocket again.'
  : 'Launch Library 2 returned no SpaceX rockets this time. Load the catalog again to retry.')

onMounted(() => {
  if (store.status === 'idle') {
    store.loadRockets()
  }
})

function handleAdd (draft: RocketDraft) {
  store.addRocket(draft)
  store.resetFilters()
  snackbarMessage.value = `${draft.name.trim()} was added to the list.`
  snackbarOpen.value = true
}
</script>

<style scoped>
.rocket-list__intro {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.rocket-list__heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.rocket-list__title {
  margin: 0;
}

.rocket-list__lede {
  margin: 0;
}

.rocket-list__count {
  font-size: var(--font-label);
  letter-spacing: 0.01em;
  margin: 0 0 var(--space-3);
}

.rocket-list__grid {
  display: grid;
  gap: var(--space-5);
  grid-template-columns: 1fr;
}

.rocket-list__empty {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-bottom: var(--space-7);
  padding-top: var(--space-7);
  text-align: center;
}

.rocket-list__empty-title {
  font-size: var(--font-title);
  font-weight: 600;
  margin: 0;
}

.rocket-list__empty-body {
  margin: 0 auto var(--space-2);
  max-width: 52ch;
}

.rocket-list__empty .v-btn {
  align-self: center;
}

@media (min-width: 600px) {
  .rocket-list__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .rocket-list__intro {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }
}

@media (min-width: 1024px) {
  .rocket-list__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>

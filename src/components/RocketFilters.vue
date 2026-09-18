<template>
  <div class="rocket-filters">
    <v-text-field
      v-model="search"
      class="rocket-filters__field rocket-filters__field--search"
      clearable
      label="Search rockets"
      placeholder="Name, description or country"
      prepend-inner-icon="mdi-magnify"
    />

    <v-select
      v-model="family"
      class="rocket-filters__field rocket-filters__field--family"
      :items="familyOptions"
      label="Family"
    />

    <v-btn
      class="rocket-filters__reset"
      :disabled="!hasActiveFilters"
      variant="text"
      @click="emit('reset')"
    >
      Clear filters
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const search = defineModel<string>('search', { required: true })
const family = defineModel<string>('family', { required: true })

const props = defineProps<{
  allFamiliesValue: string
  families: string[]
}>()

const emit = defineEmits<{ reset: [] }>()

const familyOptions = computed(() => [
  { title: 'All families', value: props.allFamiliesValue },
  ...props.families.map(name => ({ title: name, value: name })),
])

const hasActiveFilters = computed(() =>
  search.value.trim() !== '' || family.value !== props.allFamiliesValue,
)
</script>

<style scoped>
.rocket-filters {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.rocket-filters__reset {
  align-self: flex-start;
}

@media (min-width: 600px) {
  .rocket-filters {
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .rocket-filters__field--search {
    flex: 1 1 320px;
    max-width: 460px;
  }

  .rocket-filters__field--family {
    flex: 0 1 220px;
  }

  .rocket-filters__reset {
    align-self: auto;
  }
}
</style>

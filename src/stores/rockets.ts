import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRockets } from '@/services/launchLibrary'
import type { Rocket, RocketDraft } from '@/types/rocket'

export type RequestStatus = 'idle' | 'loading' | 'ready' | 'failed'

const ALL_FAMILIES = 'all'

export const useRocketsStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const status = ref<RequestStatus>('idle')
  const errorMessage = ref<string | null>(null)
  const searchTerm = ref('')
  const familyFilter = ref<string>(ALL_FAMILIES)

  let localRocketSequence = 0

  const families = computed(() => {
    const known = rockets.value
      .map(rocket => rocket.family)
      .filter((family): family is string => family !== null)
    return [...new Set(known)].sort()
  })

  const filteredRockets = computed(() => {
    const term = searchTerm.value.trim().toLowerCase()

    return rockets.value.filter(rocket => {
      if (familyFilter.value !== ALL_FAMILIES && rocket.family !== familyFilter.value) {
        return false
      }
      if (!term) {
        return true
      }
      const searchable = [rocket.name, rocket.description, rocket.family, rocket.countryCode]
        .filter((field): field is string => field !== null)
      return searchable.some(field => field.toLowerCase().includes(term))
    })
  })

  const hasActiveFilters = computed(() => searchTerm.value.trim() !== '' || familyFilter.value !== ALL_FAMILIES)

  const addedLocallyCount = computed(() => rockets.value.filter(rocket => rocket.addedLocally).length)

  async function loadRockets () {
    status.value = 'loading'
    errorMessage.value = null

    try {
      const catalog = await fetchRockets()
      const addedLocally = rockets.value.filter(rocket => rocket.addedLocally)
      rockets.value = [...addedLocally, ...catalog]
      status.value = 'ready'
    } catch (error) {
      status.value = 'failed'
      errorMessage.value = error instanceof Error
        ? error.message
        : 'The rocket catalog could not be loaded.'
    }
  }

  function addRocket (draft: RocketDraft) {
    localRocketSequence += 1

    rockets.value = [
      {
        id: -localRocketSequence,
        name: draft.name.trim(),
        family: draft.family,
        description: draft.description?.trim() || null,
        imageUrl: draft.imageUrl?.trim() || null,
        launchCost: draft.launchCost?.trim() || null,
        countryCode: draft.countryCode?.trim() || null,
        maidenFlight: draft.maidenFlight?.trim() || null,
        addedLocally: true,
      },
      ...rockets.value,
    ]
  }

  function findRocket (id: number): Rocket | null {
    return rockets.value.find(rocket => rocket.id === id) ?? null
  }

  function cacheRocket (rocket: Rocket) {
    if (!findRocket(rocket.id)) {
      rockets.value = [...rockets.value, rocket]
    }
  }

  function resetFilters () {
    searchTerm.value = ''
    familyFilter.value = ALL_FAMILIES
  }

  return {
    rockets,
    status,
    errorMessage,
    searchTerm,
    familyFilter,
    families,
    filteredRockets,
    hasActiveFilters,
    addedLocallyCount,
    loadRockets,
    addRocket,
    findRocket,
    cacheRocket,
    resetFilters,
    ALL_FAMILIES,
  }
})

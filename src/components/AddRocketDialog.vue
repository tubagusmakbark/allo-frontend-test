<template>
  <v-dialog
    v-model="open"
    max-width="680"
  >
    <v-card>
      <div class="rocket-form__head">
        <h2 class="rocket-form__title">
          Add a rocket
        </h2>
        <p class="rocket-form__note text-muted">
          Launch Library 2 is read-only, so a rocket added here stays in this browser session.
        </p>
      </div>

      <div class="rocket-form__scroll">
        <v-form
          class="rocket-form"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="draft.name"
            autofocus
            class="rocket-form__full"
            label="Rocket name"
            :rules="nameRules"
          />

          <v-select
            v-model="draft.family"
            clearable
            :items="families"
            label="Family"
          />

          <v-text-field
            v-model="draft.maidenFlight"
            label="First flight"
            type="date"
          />

          <v-textarea
            v-model="draft.description"
            class="rocket-form__full"
            label="Description"
            rows="3"
          />

          <v-text-field
            v-model="draft.imageUrl"
            class="rocket-form__full"
            label="Image URL"
            placeholder="https://"
          />

          <v-text-field
            v-model="draft.launchCost"
            label="Cost per launch (USD)"
            min="0"
            type="number"
          />

          <v-text-field
            v-model="draft.countryCode"
            label="Country code"
            maxlength="3"
            placeholder="USA"
          />
        </v-form>
      </div>

      <div class="rocket-form__actions">
        <v-btn
          variant="text"
          @click="open = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Add rocket
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import type { RocketDraft } from '@/types/rocket'

defineProps<{ families: string[] }>()

const emit = defineEmits<{ add: [draft: RocketDraft] }>()

const open = defineModel<boolean>({ required: true })

const form = ref<InstanceType<typeof VForm> | null>(null)

function emptyDraft (): RocketDraft {
  return {
    name: '',
    family: null,
    description: null,
    imageUrl: null,
    launchCost: null,
    countryCode: null,
    maidenFlight: null,
  }
}

const draft = reactive<RocketDraft>(emptyDraft())

const nameRules = [
  (value: string) => Boolean(value?.trim()) || 'Enter a rocket name.',
]

watch(open, isOpen => {
  if (!isOpen) {
    return
  }
  Object.assign(draft, emptyDraft())
  form.value?.resetValidation()
})

async function submit () {
  const validation = await form.value?.validate()
  if (!validation?.valid) {
    return
  }
  emit('add', { ...draft })
  open.value = false
}
</script>

<style scoped>
.rocket-form__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-5) var(--space-5) var(--space-3);
}

.rocket-form__title {
  font-size: var(--font-title);
  font-weight: 600;
  line-height: var(--leading-snug);
  margin: 0;
}

.rocket-form__note {
  font-size: var(--font-label);
  margin: 0;
}

.rocket-form__scroll {
  max-height: min(58vh, 520px);
  overflow-y: auto;
  padding: 0 var(--space-5) var(--space-2);
}

.rocket-form {
  display: grid;
  gap: var(--space-2) var(--space-4);
}

.rocket-form__full {
  grid-column: 1 / -1;
}

.rocket-form__actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  padding: var(--space-4) var(--space-5) var(--space-5);
}

@media (min-width: 600px) {
  .rocket-form {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

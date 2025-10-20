<template>
  <UModal :model-value="true">
    <UCard :ui="{ header: { base: 'font-bold font-mono' } }">
      <template #header>
        A unexpected issue happened
      </template>

      Please go back to Stripe Connect status page and try again.

      <template #footer>
        <UButton
          :label="$t('common.go_back')"
          :to="localeRoute({ name: 'settings' })"
        />
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const localeRoute = useLocaleRoute()
definePageMeta({ layout: 'page' })
</script>

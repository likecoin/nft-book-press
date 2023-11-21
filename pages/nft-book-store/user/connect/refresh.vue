<template>
  <UModal :model-value="true">
    <UCard :ui="{ header: { base: 'font-bold font-mono' } }">
      <template #header>
        A unexpected issue happened
      </template>

      Please go back to Stripe Connect status page and try again.

      <template #footer>
        <UButton
          label="Go Back"
          :to="{ name: 'nft-book-store-user' }"
        />
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'page' })
</script>

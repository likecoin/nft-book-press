<template>
  <PageBody
    v-if="!bookStoreApiStore.isAuthenticated"
    :ui="{ base: 'flex flex-col justify-center items-center grow w-auto' }"
  >
    <UAlert
      icon="i-heroicons-light-bulb"
      color="amber"
      variant="subtle"
      title="Sign in required"
      description="Please sign in to continue."
      :ui="{ wrapper: 'w-auto', inner: 'w-auto', title: 'font-bold' }"
    />
    <UButton
      class="block lg:hidden"
      label="Sign in"
      icon="i-heroicons-arrow-right-on-rectangle"
      color="primary"
      :loading="isAuthenticating"
      :disabled="isRestoringSession"
      block
      @click="onAuthenticate"
    />
  </PageBody>
  <slot v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useAuth } from '~/composables/useAuth'

const bookStoreApiStore = useBookStoreApiStore()
const { isRestoringSession } = storeToRefs(bookStoreApiStore)
const { isAuthenticating, onAuthenticate } = useAuth()

</script>

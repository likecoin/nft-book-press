<template>
  <PageBody
    v-if="!bookstoreApiStore.isAuthenticated"
    :ui="{ base: 'flex flex-col justify-center items-center grow w-auto' }"
  >
    <UAlert
      icon="i-heroicons-light-bulb"
      color="amber"
      variant="subtle"
      :title="$t('auth.signin_required')"
      :description="$t('auth.signin_description')"
      :ui="{ wrapper: 'w-auto', inner: 'w-auto', title: 'font-bold' }"
    />
    <UButton
      class="block lg:hidden"
      :label="$t('auth.signin')"
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
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useAuth } from '~/composables/useAuth'
const { t: $t } = useI18n()

const bookstoreApiStore = useBookstoreApiStore()
const { isRestoringSession } = storeToRefs(bookstoreApiStore)
const { isAuthenticating, onAuthenticate } = useAuth()

</script>

<template>
  <div class="flex flex-col items-stretch gap-6">
    <template v-if="bookstoreApiStore.isAuthenticated">
      <div v-if="isFetchingUserLikerInfo" class="flex items-center space-x-4">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
      <div v-else class="flex flex-col justify-center items-center gap-2">
        <UAvatar v-if="userLikerInfo" :src="userLikerInfo?.avatar" size="md" />
        <p
          class="font-mono text-sm truncate font-semibold text-gray-600"
          v-text="userLikerInfo?.displayName || userLikerInfo?.user || wallet"
        />
      </div>
      <UButton
        :label="$t('auth_state.sign_out')"
        icon="i-heroicons-arrow-left-on-rectangle"
        color="gray"
        variant="outline"
        size="md"
        block
        @click="onClickDisconnect"
      />
    </template>
    <div v-else class="flex flex-col gap-4">
      <div class="flex gap-2">
        <UButton
          class="w-full"
          :label="$t('auth_state.login')"
          color="black"
          size="lg"
          :loading="isAuthenticating"
          :disabled="isRestoringSession"
          block
          @click="bookstoreApiStore.openLoginPanel()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useUserStore } from '~/stores/user'
import { useAuth } from '~/composables/useAuth'
const { t: $t } = useI18n()

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { disconnect } = store
const bookstoreApiStore = useBookstoreApiStore()
const { clearSession } = bookstoreApiStore
const { isRestoringSession } = storeToRefs(bookstoreApiStore)
const { isAuthenticating } = useAuth()
const userStore = useUserStore()
const { userLikerInfo, isFetchingUserLikerInfo } = storeToRefs(userStore)

onMounted(async () => {
  if (bookstoreApiStore.isAuthenticated) {
    await userStore.fetchUserLikerInfo({ nocache: true })
  }
})

function onClickDisconnect () {
  disconnect()
  clearSession()
}
</script>

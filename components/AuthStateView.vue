<template>
  <div class="flex flex-col items-stretch gap-4">
    <template v-if="bookstoreApiStore.isAuthenticated">
      <div class="w-full flex items-center gap-[8px] justify-between">
        <UTooltip class="flex w-full" :text="wallet">
          <UButton
            class="text-xs font-mono"
            :label="shortenWalletAddress(wallet)"
            :to="portfolioURL"
            variant="soft"
            block
            target="_blank"
          />
        </UTooltip>
        <UTooltip :text="$t('auth_state.copy_address')">
          <UButton
            icon="i-heroicons-document-duplicate"
            size="sm"
            square
            variant="soft"
            @click="onClickCopy"
          />
        </UTooltip>
      </div>

      <UButton
        :label="$t('auth_state.sign_out')"
        icon="i-heroicons-arrow-left-on-rectangle"
        color="primary"
        variant="outline"
        size="lg"
        block
        @click="onClickDisconnect"
      />
    </template>
    <div v-else class="flex flex-col gap-4">
      <div class="flex gap-2">
        <UButton
          class="w-full"
          :label="$t('auth_state.login')"
          color="primary"
          size="lg"
          :loading="isAuthenticating"
          :disabled="isRestoringSession"
          block
          @click="showLoginPanel = true"
        />
      </div>
    </div>
    <UModal
      v-model="showLoginPanel"
      :close="{ onClick: () => showLoginPanel = false }"
      :ui="{ width: '!max-w-[348px]' }"
    >
      <LoginPanel
        :migration-url="migrationURL"
        @connect="onAuthenticate"
      />
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { getPortfolioURL, copyToClipboard, appendUTMParamsToURL } from '~/utils/index'
import { shortenWalletAddress } from '~/utils/cosmos'
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useAuth } from '~/composables/useAuth'
const { t: $t } = useI18n()

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { disconnect } = store
const bookstoreApiStore = useBookstoreApiStore()
const { clearSession } = bookstoreApiStore
const { isRestoringSession } = storeToRefs(bookstoreApiStore)
const { isAuthenticating, onAuthenticate } = useAuth()

const { LIKECOIN_V3_BOOK_MIGRATION_SITE_URL } = useRuntimeConfig().public
const migrationURL = appendUTMParamsToURL({
  url: LIKECOIN_V3_BOOK_MIGRATION_SITE_URL,
  medium: 'login',
  campaign: 'migration'
})

const portfolioURL = computed(() => getPortfolioURL(wallet.value))
const showLoginPanel = ref(false)

// Auto close modal when authenticated
watch(() => bookstoreApiStore.isAuthenticated, (isAuthenticated: boolean) => {
  if (isAuthenticated && showLoginPanel.value) {
    showLoginPanel.value = false
  }
})

function onClickDisconnect () {
  disconnect()
  clearSession()
}

function onClickCopy () {
  if (wallet.value) {
    copyToClipboard(wallet.value)
  }
}
</script>

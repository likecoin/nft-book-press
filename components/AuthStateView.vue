<template>
  <div class="flex flex-col items-stretch gap-4">
    <template v-if="bookStoreApiStore.isAuthenticated">
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
        <UTooltip text="Copy address">
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
        label="Sign out"
        icon="i-heroicons-arrow-left-on-rectangle"
        color="primary"
        variant="outline"
        size="lg"
        block
        @click="onClickDisconnect"
      />
    </template>
    <div v-else class="flex flex-col gap-4">
      <UButton
        label="Sign in"
        icon="i-heroicons-arrow-right-on-rectangle"
        color="primary"
        size="lg"
        :loading="isAuthenticating"
        :disabled="isRestoringSession"
        block
        @click="onAuthenticate"
      />
      <UAlert
        icon="i-heroicons-exclamation-circle"
        color="orange"
        variant="soft"
        description="If this is your first time visiting from publish.liker.land, please migrate your account to the new platform"
        :actions="[{
          label: 'Start Migration',
          color: 'orange',
          variant: 'outline',
          click: onClickMigrate,
        }]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import { getPortfolioURL, copyToClipboard, appendUTMParamsToURL } from '~/utils/index'
import { shortenWalletAddress } from '~/utils/cosmos'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useAuth } from '~/composables/useAuth'

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { disconnect } = store
const bookStoreApiStore = useBookStoreApiStore()
const { clearSession } = bookStoreApiStore
const { isRestoringSession } = storeToRefs(bookStoreApiStore)
const { isAuthenticating, onAuthenticate } = useAuth()

const { LIKECOIN_V3_BOOK_MIGRATION_SITE_URL } = useRuntimeConfig().public
const migrationURL = appendUTMParamsToURL({
  url: LIKECOIN_V3_BOOK_MIGRATION_SITE_URL,
  medium: 'login',
  campaign: 'migration'
})

const portfolioURL = computed(() => getPortfolioURL(wallet.value))

function onClickDisconnect () {
  disconnect()
  clearSession()
}

function onClickCopy () {
  copyToClipboard(wallet.value)
}

function onClickMigrate () {
  window.open(migrationURL, '_blank', 'noopener noreferrer')
}
</script>

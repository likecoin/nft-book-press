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
          class="w-1/2"
          :label="$t('auth_state.login')"
          icon="i-heroicons-envelope"
          color="primary"
          size="lg"
          :loading="isAuthenticating"
          :disabled="isRestoringSession"
          block
          @click="onAuthenticate(0)"
        />
        <UButton
          class="w-1/2"
          :label="$t('auth_state.wallet')"
          icon="i-heroicons-wallet"
          color="primary"
          size="lg"
          :loading="isAuthenticating"
          :disabled="isRestoringSession"
          block
          @click="onAuthenticate(1)"
        />
      </div>

      <UAlert
        v-if="showMigrateAlert"
        :ui="{ actions: 'justify-end' }"
        icon="i-heroicons-exclamation-circle"
        color="orange"
        variant="soft"
        :description="$t('auth_state.migration_notice')"
        :actions="[
          {
            label: $t('auth_state.close'),
            color: 'gray',
            variant: 'ghost',
            click: closeMigrateAlert,
          },
          {
            label: $t('auth_state.migrate'),
            color: 'orange',
            variant: 'outline',
            click: onClickMigrate,
          }
        ]"
      />
    </div>
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
const { show: showMigrateAlert, close: closeMigrateAlert } = useOneTimePopup('bookPressMigrateAlert:v3')

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
  if (wallet.value) {
    copyToClipboard(wallet.value)
  }
}

function onClickMigrate () {
  window.open(migrationURL, '_blank', 'noopener noreferrer')
}
</script>

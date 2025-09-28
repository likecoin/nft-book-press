<template>
  <div class="flex flex-col items-stretch gap-6">
    <template v-if="hasLoggedIn">
      <div v-if="hasLoggedIn && !user?.likerId" class="flex items-center space-x-4">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
      <div v-else class="flex flex-col justify-center items-center gap-1">
        <UAvatar v-if="user?.likerId" :src="user?.avatar" size="sm" />
        <p
          class="font-mono text-center text-sm truncate text-gray-600 w-full"
          v-text="user?.displayName || user?.evmWallet || wallet"
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
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
const { t: $t } = useI18n()
const { fetch: refreshSession, loggedIn: hasLoggedIn, user } = useUserSession()

const store = useWalletStore()
const { wallet } = storeToRefs(store)
const { disconnect } = store
const userStore = useUserStore()

onMounted(async () => {
  if (hasLoggedIn.value) {
    await userStore.fetchUserLikerInfo()
  }
})

async function onClickDisconnect () {
  disconnect()
  await $fetch('/api/logout', { method: 'POST' })
  await refreshSession()
}
</script>

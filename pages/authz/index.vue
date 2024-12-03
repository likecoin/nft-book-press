<template>
  <PageContainer>
    <PageHeader title=" Send NFT Authz Grants Management Page" />

    <AuthRequiredView>
      <PageBody class="grow space-y-4">
        <UAlert
          v-if="error"
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="soft"
          :title="`${error}`"
          :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
          @close="error = ''"
        />

        <UProgress v-if="isLoading" animation="carousel">
          <template #indicator>
            Loading...
          </template>
        </UProgress>

        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="amber"
          variant="soft"
          title="Warning"
          :ui="{ title: 'font-bold font-mono', description: 'leading-5' }"
        >
          <template #description>
            Granting other wallet send NFT Authz permission allows them to send away <b>ANY</b> NFT you own,
            not limited to NFT books or NFT you created. Use with <b>CAUTION</b> and <b>ONLY</b> grant to those you absolutely trust!
          </template>
        </UAlert>

        <UCard>
          <template #header>
            <h2 class="font-bold font-mono">
              Current Grants
            </h2>
          </template>

          <UCard :ui="{ body: { padding: '' } }">
            <UTable
              :columns="[
                {
                  key: 'wallet',
                  label: 'Wallet',
                  sortable: true
                },
                {
                  key: 'expiration',
                  label: 'Expiration',
                  sortable: true
                },
                { key: 'actions' },
              ]"
              :rows="tableRows"
              :sort="{ column: 'expiration', direction: 'desc' }"
            >
              <template #wallet-data="{ row }">
                <UTooltip :text="row.wallet">
                  <UButton
                    class="font-mono"
                    :label="row.shortenWallet"
                    :to="getPortfolioURL(row.wallet)"
                    variant="link"
                    :padded="false"
                    size="xs"
                    target="_blank"
                  />
                </UTooltip>
              </template>
              <template #actions-data="{ row }">
                <div class="flex items-center gap-2">
                  <UButton
                    label="Renew"
                    variant="outline"
                    :disabled="isLoading"
                    @click="onClickRenewGrant(row.wallet)"
                  />
                  <UButton
                    label="Revoke"
                    variant="outline"
                    :disabled="isLoading"
                    @click="onClickRevokeGrant(row.wallet)"
                  />
                </div>
              </template>
            </UTable>
          </UCard>
        </UCard>

        <UCard>
          <template #header>
            <h2 class="font-bold font-mono">
              Grant new send NFT Authz
            </h2>
          </template>

          <UInput
            v-model="newGrantee"
            class="font-mono"
            placeholder="like1..."
          />

          <template #footer>
            <UButton
              label="Submit"
              :loading="isLoading"
              :disabled="!newGrantee || isLoading"
              @click="onNewGrant()"
            />
          </template>
        </UCard>
      </PageBody>
    </AuthRequiredView>
  </PageContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getPortfolioURL } from '~/utils'
import { useWalletStore } from '~/stores/wallet'
import {
  getNFTAuthzGranterGrants,
  signGrantNFTSendAuthz,
  signRevokeNFTSendAuthz,
  shortenWalletAddress
} from '~/utils/cosmos'

const walletStore = useWalletStore()
const { wallet, signer } = storeToRefs(walletStore)
const route = useRoute()

const error = ref('')
const newGrantee = ref(route.query.grantee as string || '')
const grants = ref([] as any)
const isLoading = ref(false)

const tableRows = computed(() => grants.value.map((grant: any) => ({
  wallet: grant.grantee,
  shortenWallet: shortenWalletAddress(grant.grantee),
  expiration: new Date(grant.expiration.seconds.toNumber() * 1000)
})))

watch(wallet, async (wallet) => {
  if (wallet) {
    error.value = ''
    try {
      await fetchAuthzGrants()
    } catch {}
    if (newGrantee.value && !grants.value.find(g => g.grantee === newGrantee.value)) {
      onNewGrant(newGrantee.value)
    }
  } else {
    grants.value = []
  }
}, { immediate: true })

useSeoMeta({
  title: 'Send LikeCoin NFT Authz Grants Management',
  ogTitle: 'Send LikeCoin NFT Authz Grants Management',
})

async function fetchAuthzGrants () {
  const g = await getNFTAuthzGranterGrants(wallet.value)
  grants.value = g
}

async function onNewGrant (grantee = newGrantee.value) {
  try {
    error.value = ''
    isLoading.value = true
    if (!wallet.value || !signer.value) { throw new Error('NO_WALLET') }
    if (!grantee) { throw new Error('WALLET_INPUT_EMPTY') }
    const res = await signGrantNFTSendAuthz(grantee, signer.value, wallet.value)
    console.log(res)
    await fetchAuthzGrants()
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}
function onClickRenewGrant (grantee) {
  onNewGrant(grantee)
}

async function onClickRevokeGrant (grantee) {
  try {
    error.value = ''
    isLoading.value = true
    if (!wallet.value || !signer.value) { throw new Error('NO_WALLET') }
    if (!grantee) { throw new Error('WALLET_INPUT_EMPTY') }
    const res = await signRevokeNFTSendAuthz(grantee, signer.value, wallet.value)
    console.log(res)
    await fetchAuthzGrants()
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}
</script>

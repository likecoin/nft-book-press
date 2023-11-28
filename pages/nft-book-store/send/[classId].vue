<template>
  <main class="space-y-4">
    <h1 class="text-lg font-bold font-mono">
      Deliver NFT Book "{{ nftClassName || classId }}"
    </h1>

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

    <UCard
      v-if="bookStoreApiStore.isAuthenticated"
      :ui="{ body: { base: 'space-y-4' } }"
    >
      <UCard :ui="{ body: { padding: '' } }">
        <table class="divide-y w-full">
          <tr>
            <th class="text-left px-4 py-3">
              Buyer Email
            </th><td class="px-4 py-3">
              {{ orderInfo.email }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Status
            </th><td class="px-4 py-3">
              {{ orderInfo.status }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Buyer Wallet
            </th><td class="px-4 py-3">
              {{ orderInfo.wallet }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Price Name
            </th><td class="px-4 py-3">
              {{ orderInfo.priceName }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Price
            </th><td class="px-4 py-3">
              {{ orderInfo.price }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Buyer message
            </th><td class="px-4 py-3">
              {{ orderInfo.message }}
            </td>
          </tr>
          <tr>
            <th class="text-left px-4 py-3">
              Sales channel
            </th><td class="px-4 py-3">
              {{ orderInfo.from }}
            </td>
          </tr>
        </table>
      </UCard>

      <UFormGroup label="Enter Author's Message" hint="optional">
        <UTextarea v-model="memo" placeholder="default memo" />
      </UFormGroup>

      <UFormGroup label="Specify NFT ID">
        <UInput v-model="nftId" class="font-mono" placeholder="leave empty to auto-fetch" />

        <template #help>
          <UButton
            v-if="!nftId"
            label="Auto-fetch NFT ID"
            :disabled="isLoading"
            variant="outline"
            @click="fetchNftId"
          />
        </template>
      </UFormGroup>

      <div>
        <img v-if="nftImage" :src="nftImage" height="128" style="display:block">
        <div
          v-else
          style="display: table-cell; vertical-align: middle; height: 128px; width: 90px; border-radius: 8px; background-color: #f7f7f7; border: 1px solid #ececec; text-align: center;"
        >
          <span style="font-size: 12px; color: #4a4a4a">NFT Preview</span>
        </div>
      </div>

      <template #footer>
        <UButton
          label="Sign and Send"
          :disabled="isSendButtonDisabled"
          @click="onSendNFTStart"
        />
      </template>
    </UCard>
  </main>
</template>

<script setup lang="ts">
import { DeliverTxResponse } from '@cosmjs/stargate'
import { storeToRefs } from 'pinia'
import { LIKE_CO_API, LCD_URL } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useNftStore } from '~/stores/nft'
import { parseImageURLFromMetadata } from '~/utils'
import { signExecNFTSendAuthz, signSendNFT } from '~/utils/cosmos'

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { connect } = store

const bookStoreApiStore = useBookStoreApiStore()
const { token } = storeToRefs(bookStoreApiStore)

const nftStore = useNftStore()
const { lazyFetchClassMetadataById } = nftStore

const route = useRoute()
const router = useRouter()

const error = ref('')
const isLoading = ref(false)
const classId = ref(route.params.classId as string)
const paymentId = ref(route.query.payment_id as string)
const ownerWallet = ref(route.query.owner_wallet as string || wallet.value)
const memo = ref('')
const nftId = ref('')
const orderInfo = ref<any>({})
const nftImage = ref('')

const userIsOwner = computed(() => wallet.value && ownerWallet.value === wallet.value)
const isSendButtonDisabled = computed(() => !nftId.value || isLoading.value)

const nftClassName = computed(() => nftStore.getClassMetadataById(classId.value as string)?.name)

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(nftId, async (newNftId) => {
  if (newNftId) {
    const { data, error: fetchError } = await useFetch(`${LCD_URL}/cosmos/nft/v1beta1/nfts/${classId.value}/${newNftId}`)
    if (fetchError.value) {
      nftImage.value = ''
      error.value = fetchError.value.toString()
      return
    }
    const image = (data.value as any)?.nft?.data?.metadata?.image || ''
    nftImage.value = parseImageURLFromMetadata(image)
  } else {
    nftImage.value = ''
  }
})

onMounted(async () => {
  const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/status/${paymentId.value}`,
    {
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
  if (fetchError.value) {
    if (fetchError.value.statusCode === 403) {
      error.value = 'NOT_OWNER_OF_NFT_CLASS'
    } else {
      error.value = fetchError.value.toString()
    }
  } else {
    orderInfo.value = (data.value as any)
  }
  lazyFetchClassMetadataById(classId.value as string)
})

async function fetchNftId () {
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await connect()
    }
    if (!ownerWallet.value) { return }
    const { nfts } = await getNFTs({
      classId: classId.value,
      owner: ownerWallet.value,
      needCount: 1
    })
    if (nfts.length) {
      nftId.value = nfts[0].id
    } else {
      throw new Error(`${ownerWallet.value} does not hold any NFT of class ${classId.value}`)
    }
  } catch (err) {
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

async function onSendNFTStart () {
  if (isSendButtonDisabled.value) { return }
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await connect()
    }
    if (!wallet.value || !signer.value) { return }
    let targetNftId = ''
    if (nftId.value) {
      const { owner } = await getNFTOwner(classId.value, nftId.value)
      if (owner !== ownerWallet.value) {
        throw new Error(`NFT classId: ${classId} nftId:${nftId} is not owned by sender!`)
      }
    } else {
      await fetchNftId()
    }
    targetNftId = nftId.value

    const signingClient = await getSigningClientWithSigner(signer.value)
    const client = signingClient.getSigningStargateClient()
    if (!client) { throw new Error('Signing client not exists') }

    let res: DeliverTxResponse | undefined
    if (userIsOwner.value) {
      res = await signSendNFT(
        orderInfo.value.wallet,
        classId.value,
        targetNftId,
        signer.value,
        wallet.value,
        memo.value
      )
    } else {
      res = await signExecNFTSendAuthz(
        orderInfo.value.wallet,
        ownerWallet.value,
        classId.value,
        targetNftId,
        signer.value,
        wallet.value,
        memo.value
      )
    }

    if (res.transactionHash && res.code === 0) {
      const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/sent/${paymentId.value}`,
        {
          method: 'POST',
          body: { txHash: res.transactionHash },
          headers: {
            authorization: `Bearer ${token.value}`
          }
        })
      if (fetchError.value) {
        throw fetchError.value
      }
      router.push({
        name: 'nft-book-store-status-classId',
        params: {
          classId: classId.value
        }
      })
    }
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

</script>

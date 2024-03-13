<template>
  <main class="space-y-4">
    <h1 class="text-lg font-bold font-mono">
      Deliver NFT Book Collection "{{ collectionName || collectionId }}"
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
      :ui="{
        body: { base: 'space-y-4' },
        footer: { base: 'flex justify-center gap-2' }
      }"
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
              Reader Email
            </th><td class="px-4 py-3">
              {{ orderInfo.giftInfo?.toEmail || orderInfo.email }}
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

      <UFormGroup
        label="Specify NFT ID"
        :error="nftIdError"
      >
        <div v-for="(classId, index) in classIds" :key="classId">
          <label>{{ getNftClassName(classId) + ': ' + classId }}</label>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <UInput
              ref="nftIdInputRef"
              v-model="nftIds[index]"
              class="font-mono flex-grow"
              :readonly="!isEditingNFTId"
              :disabled="!isEditingNFTId"
              placeholder="Leave empty to auto-fetch NFT ID"
              :trailing-icon="nftIdError ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
            />
            <UButton
              :label="isEditingNFTId || (isVerifyingNFTId && !isAutoFetchingNFTId) ? 'Confirm' : 'Edit'"
              :disabled="isLoading || isVerifyingNFTId"
              variant="outline"
              :loading="isVerifyingNFTId && !isAutoFetchingNFTId"
              color="gray"
              @click="handleClickEditNFTId"
            />
            <UDivider class="text-sm text-gray-600 sm:w-min">
              OR
            </UDivider>
            <UButton
              label="Auto-fetch NFT ID"
              :disabled="isLoading || isEditingNFTId"
              :loading="isAutoFetchingNFTId"
              variant="outline"
              @click="fetchNextNFTId"
            />
          </div>
          <PlaceholderCard class="h-[300px]">
            <img
              v-if="nftImages[index]"
              class="max-w-[180px] w-full h-full object-contain"
              :src="nftImages[index]"
            >
          </PlaceholderCard>
        </div>
      </UFormGroup>

      <template #footer>
        <UButton
          label="Sign and Send"
          :disabled="isSendButtonDisabled"
          size="xl"
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
import { useCollectionStore } from '~/stores/collection'
import { parseImageURLFromMetadata } from '~/utils'
import { getNFTs, getNFTOwner, signExecNFTSendAuthz, signSendNFTs } from '~/utils/cosmos'

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { connect } = store

const bookStoreApiStore = useBookStoreApiStore()
const { token } = storeToRefs(bookStoreApiStore)

const nftStore = useNftStore()
const collectionStore = useCollectionStore()
const { lazyFetchClassMetadataById } = nftStore
const { lazyFetchCollectionById } = collectionStore

const route = useRoute()
const router = useRouter()

const error = ref('')
const isLoading = ref(false)
const collectionId = ref(route.params.collectionId as string)
const paymentId = ref(route.query.payment_id as string)
const ownerWallet = ref(route.query.owner_wallet as string || wallet.value)
const memo = ref('')

const nftIds = ref<string[]>([])
const isVerifyingNFTId = ref(false)
const isAutoFetchingNFTId = ref(false)
const nftIdError = ref('')
const isEditingNFTId = ref(false)
const nftIdInputRef = ref<any>(undefined)

const orderInfo = ref<any>({})
const nftImages = ref<string[]>([])

const userIsOwner = computed(() => wallet.value && ownerWallet.value === wallet.value)
const isSendButtonDisabled = computed(() => isEditingNFTId.value || isLoading.value || isVerifyingNFTId.value || isAutoFetchingNFTId.value || !!nftIdError.value)

const collectionName = computed(() => collectionStore.getCollectionById(collectionId.value as string)?.name)
const classIds = computed(() => collectionStore.getCollectionById(collectionId.value as string)?.classIds)

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(isEditingNFTId, (isEditing) => {
  if (isEditing) { return }

  nftIds.value.forEach(async (nftId, index) => {
    if (nftId) {
      nftImages.value[index] = await fetchNFTMetadataImage(classIds.value[index], nftId)
    } else {
      nftImages.value[index] = ''
    }
  })
})

onMounted(async () => {
  const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/status/${paymentId.value}`,
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
  await lazyFetchCollectionById(collectionId.value as string)
  await Promise.all(classIds.value.map(classId => lazyFetchClassMetadataById(classId)))
  fetchNextNFTId()
})

function getNftClassName (classId) {
  return nftStore.getClassMetadataById(classId)?.name
}

function handleClickEditNFTId () {
  isEditingNFTId.value = !isEditingNFTId.value
  nftIdError.value = ''
  nextTick(() => {
    if (isEditingNFTId.value) {
      nftIdInputRef.value?.$refs?.input?.focus()
    }
  })
}

async function fetchNFTMetadataImage (classId, nftId) {
  try {
    isVerifyingNFTId.value = true
    const { data, error: fetchError } = await useFetch(`${LCD_URL}/cosmos/nft/v1beta1/nfts/${classId}/${nftId}`)
    if (fetchError.value) {
      if (fetchError.value.data.code === 2) {
        nftIdError.value = 'NFT not found'
      } else {
        nftIdError.value = fetchError.value.toString()
      }
      return ''
    }
    const image = (data.value as any)?.nft?.data?.metadata?.image || ''
    return parseImageURLFromMetadata(image)
  } catch (err) {
    error.value = (err as Error).toString()
  } finally {
    isVerifyingNFTId.value = false
  }
}

async function fetchNextNFTId () {
  try {
    nftIdError.value = ''
    isAutoFetchingNFTId.value = true
    if (!wallet.value || !signer.value) {
      await connect()
    }
    if (!ownerWallet.value) { return }
    await Promise.all(classIds.value.map(async (classId, index) => {
      if (!nftIds.value[index]) {
        const { nfts } = await getNFTs({
          classId,
          owner: ownerWallet.value,
          needCount: 1
        })
        if (nfts.length) {
          nftIds.value[index] = nfts[0].id
          nftImages.value[index] = await fetchNFTMetadataImage(classId, nftIds.value[index])
        } else {
          throw new Error(`${ownerWallet.value} does not hold any NFT of class ${classId}`)
        }
      }
    }))
  } catch (err) {
    error.value = (err as Error).toString()
  } finally {
    isAutoFetchingNFTId.value = false
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

    await fetchNextNFTId()
    Promise.all(classIds.value.map(async (classId, index) => {
      if (nftIds.value[index]) {
        const { owner } = await getNFTOwner(classId, nftIds.value[index])
        if (owner !== ownerWallet.value) {
          throw new Error(`NFT classId: ${classId} nftId:${nftIds.value[index]} is not owned by sender!`)
        }
      }
    }))

    if (classIds.value.find(id => !id)) {
      throw new Error('Please specify NFT class ID')
    }
    if (nftIds.value.find(id => !id)) {
      throw new Error('Please specify NFT ID')
    }

    const signingClient = await getSigningClientWithSigner(signer.value)
    const client = signingClient.getSigningStargateClient()
    if (!client) { throw new Error('Signing client not exists') }

    let res: DeliverTxResponse | undefined
    if (userIsOwner.value) {
      res = await signSendNFTs(
        orderInfo.value.wallet,
        classIds.value,
        nftIds.value,
        signer.value,
        wallet.value,
        memo.value
      )
    } else {
      res = await signExecNFTSendAuthz(
        orderInfo.value.wallet,
        ownerWallet.value,
        classIds.value,
        nftIds.value,
        signer.value,
        wallet.value,
        memo.value
      )
    }

    if (res.transactionHash && res.code === 0) {
      const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/sent/${paymentId.value}`,
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
        name: 'nft-book-store-collection-status-collectionId',
        params: {
          collectionId: collectionId.value
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

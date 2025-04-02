<template>
  <PageBody>
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
          <tbody>
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
                Quantity
              </th><td class="text-left px-4 py-3">
                {{ orderInfo.quantity }}
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
          </tbody>
        </table>
      </UCard>

      <UFormGroup
        label="Enter Author's Message"
        :error="isLimitReached"
        :hint="`${messageCharCount} / ${AUTHOR_MESSAGE_LIMIT}`"
      >
        <UTextarea
          v-model="memo"
          placeholder="default memo"
        />
      </UFormGroup>

      <UFormGroup
        label="Specify NFT ID"
        :error="nftIdError"
      >
        <div v-for="(classId, index) in classIds" :key="classId">
          <label>{{ getNftClassName(classId) + ': ' + classId }}</label>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <template v-if="orderInfo.quantity === 1">
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
            </template>
            <UButton
              :label="`Auto-fetch NFT ID for ${orderInfo.quantity} orders`"
              :disabled="isLoading || isEditingNFTId"
              :loading="isAutoFetchingNFTId"
              variant="outline"
              @click="onClickFetchNextNFTId"
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
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWriteContract } from '@wagmi/vue'
import { waitForTransactionReceipt } from '@wagmi/vue/actions'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'
import { parseImageURLFromMetadata } from '~/utils'
import { useMessageCharCount } from '~/composables/useMessageCharCount'
import { AUTHOR_MESSAGE_LIMIT } from '~/constant'
import { LIKE_NFT_CLASS_ABI } from '~/contracts/likeNFT'
import { config } from '~/utils/wagmi/config'

const { LIKE_CO_API } = useRuntimeConfig().public
const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { initIfNecessary } = store

const bookStoreApiStore = useBookStoreApiStore()
const { token } = storeToRefs(bookStoreApiStore)

const nftStore = useNftStore()
const collectionStore = useCollectionStore()
const { lazyFetchClassMetadataById } = nftStore
const { lazyFetchCollectionById } = collectionStore

const {
  getNFTMetadata,
  getNFTOwner,
  getBalanceOf,
  getTokenIdByOwnerIndex
} = useNFTContractReader()
const { writeContractAsync } = useWriteContract()

const route = useRoute()
const router = useRouter()

const error = ref('')
const isLoading = ref(false)
const collectionId = ref(route.params.collectionId as string)
const paymentId = ref(route.query.payment_id as string)
const ownerWallet = ref(route.query.owner_wallet as string || wallet.value)
const memo = ref('')
const { messageCharCount, isLimitReached } = useMessageCharCount(memo, AUTHOR_MESSAGE_LIMIT)

const nftIds = ref<string[]>([])
const nftNestedIds = ref<string[][]>([])
const isVerifyingNFTId = ref(false)
const isAutoFetchingNFTId = ref(false)
const nftIdError = ref('')
const isEditingNFTId = ref(false)
const nftIdInputRef = ref<any>(undefined)

const orderInfo = ref<any>({})
const nftImages = ref<string[]>([])

const isSendButtonDisabled = computed(() => isEditingNFTId.value || isLoading.value || isVerifyingNFTId.value || isAutoFetchingNFTId.value || !!nftIdError.value || isLimitReached.value)

const collectionName = computed(() => collectionStore.getCollectionById(collectionId.value as string)?.name as string)
const classIds = computed(() => collectionStore.getCollectionById(collectionId.value as string)?.classIds as string[])

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(isEditingNFTId, (isEditing) => {
  if (isEditing) { return }

  nftIds.value.forEach(async (nftId, index) => {
    if (nftId) {
      const metadata = await getNFTMetadata(classIds.value[index], parseInt(nftId, 10))
      nftImages.value[index] = parseImageURLFromMetadata(metadata?.image)
    } else {
      nftImages.value[index] = ''
    }
  })
})

onMounted(async () => {
  const data = await $fetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/status/${paymentId.value}`,
    {
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
  orderInfo.value = (data as any)
  await lazyFetchCollectionById(collectionId.value as string)
  await Promise.all(classIds.value.map((classId: string) => lazyFetchClassMetadataById(classId)))
  fetchNextNFTId(orderInfo.value.quantity || 1)
})

function getNftClassName (classId: string) {
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

async function fetchNFTMetadataImage (classId: string, nftId: string): Promise<string> {
  try {
    isVerifyingNFTId.value = true
    const metadata = await getNFTMetadata(classId, parseInt(nftId, 10))
    const image = parseImageURLFromMetadata(metadata?.image)
    return image
  } catch (err) {
    error.value = (err as Error).toString()
    return ''
  } finally {
    isVerifyingNFTId.value = false
  }
}

async function fetchNextNFTId (count = 1) {
  try {
    nftIdError.value = ''
    isAutoFetchingNFTId.value = true
    nftNestedIds.value = []
    if (!wallet.value || !signer.value) {
      await initIfNecessary()
    }
    if (!ownerWallet.value) { return }
    await Promise.all(classIds.value.map(async (classId: string, index: number) => {
      if (!nftNestedIds.value[index]) {
        const balance = await getBalanceOf(classId, ownerWallet.value as string) as bigint
        if (Number(balance) < count) {
          throw new Error(`Insufficient balance of NFT classId: ${classId} for wallet: ${ownerWallet.value}`)
        }

        nftNestedIds.value[index] = []
        for (let i = 0; i < count; i++) {
          const nextNftId = await getTokenIdByOwnerIndex(classId, ownerWallet.value as string, i)
          nftNestedIds.value[index].push(nextNftId as string)
          nftIds.value[index] = nftNestedIds.value[index][0]
          nftImages.value[index] = await fetchNFTMetadataImage(classId, nftIds.value[index]) || ''
        }
      }
    }))
  } catch (err) {
    error.value = (err as Error).toString()
  } finally {
    isAutoFetchingNFTId.value = false
  }
}

function onClickFetchNextNFTId () {
  fetchNextNFTId(orderInfo.value.quantity || 1)
}

async function onSendNFTStart () {
  if (isSendButtonDisabled.value) { return }
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await initIfNecessary()
    }
    if (!wallet.value || !signer.value) { return }

    await fetchNextNFTId(orderInfo.value.quantity)
    await Promise.all(classIds.value.map(async (classId: string, index: number) => {
      if (nftIds.value[index]) {
        const owner = await getNFTOwner(classId, parseInt(nftIds.value[index], 10))
        if (owner !== ownerWallet.value) {
          throw new Error(`NFT classId: ${classId} nftId:${nftIds.value[index]} is not owned by sender!`)
        }
      }
    }))

    if (classIds.value.find((id: string) => !id)) {
      throw new Error('Please specify NFT class ID')
    }
    if (nftIds.value.find(id => !id)) {
      throw new Error('Please specify NFT ID')
    }

    let receipt
    let txHash

    for (let i = 0; i < classIds.value.length; i++) {
      const classId = classIds.value[i]
      txHash = await writeContractAsync({
        address: classId as `0x${string}`,
        abi: LIKE_NFT_CLASS_ABI,
        functionName: 'batchTransferWithMemo',
        args: [
          wallet.value,
          Array(orderInfo.value.quantity).fill(orderInfo.value.wallet),
          nftNestedIds.value[i],
          Array(orderInfo.value.quantity).fill(memo.value)
        ]
      })
      receipt = await waitForTransactionReceipt(config, { hash: txHash })
    }
    if (receipt?.status === 'success') {
      await $fetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/sent/${paymentId.value}`,
        {
          method: 'POST',
          body: {
            txHash,
            quantity: orderInfo.value.quantity || 1
          },
          headers: {
            authorization: `Bearer ${token.value}`
          }
        })
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

<template>
  <PageBody>
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
                Quantity
              </th><td class="px-4 py-3">
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
        description="Leave empty to auto-fetch NFT ID"
        :error="nftIdError"
        :ui="{ description: 'text-gray-400 dark:text-gray-600' }"
      >
        <div class="flex flex-wrap items-center justify-center gap-2 w-full">
          <div
            v-if="orderInfo.quantity"
            :class="[orderInfo.quantity > 1 ? 'w-full' : 'flex-grow', 'space-y-1']"
          >
            <UInput
              v-for="i in orderInfo.quantity"
              :key="`nft-id-input-${i}`"
              ref="nftIdInputRef"
              v-model="nftIdInput[i - 1]"
              class="font-mono"
              :readonly="!isEditingNFTId"
              :disabled="!isEditingNFTId"
            >
              <template v-if="orderInfo.quantity > 1" #leading>
                <span class="text-sm text-gray-400 dark:text-gray-600">#{{ i }}</span>
              </template>
            </UInput>
          </div>
          <UButton
            :label="isEditingNFTId || (isVerifyingNFTId && !isAutoFetchingNFTId) ? 'Confirm' : 'Edit'"
            :disabled="isLoading || isVerifyingNFTId"
            variant="outline"
            :loading="isVerifyingNFTId && !isAutoFetchingNFTId"
            color="gray"
            @click="handleClickEditNFTId"
          />
          <UDivider :class="['text-sm text-gray-600', { 'sm:w-min': orderInfo.quantity <= 1 }]">
            OR
          </UDivider>
          <UButton
            :label="`Auto-fetch NFT ID for ${orderInfo.quantity} NFTs`"
            :disabled="isLoading || isEditingNFTId"
            :loading="isAutoFetchingNFTId"
            variant="outline"
            @click="onClickFetchNextNFTId"
          />
        </div>
      </UFormGroup>

      <PlaceholderCard class="h-[300px]">
        <img
          v-if="nftImage"
          class="max-w-[180px] w-full h-full object-contain"
          :src="nftImage"
        >
      </PlaceholderCard>

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
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useNftStore } from '~/stores/nft'
import { parseImageURLFromMetadata } from '~/utils'
import { signSendNFTs } from '~/utils/cosmos'
import { useMessageCharCount } from '~/composables/useMessageCharCount'
import { AUTHOR_MESSAGE_LIMIT } from '~/constant'

const { LIKE_CO_API, LCD_URL } = useRuntimeConfig().public

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { initIfNecessary } = store

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
const { messageCharCount, isLimitReached } = useMessageCharCount(memo, AUTHOR_MESSAGE_LIMIT)

const nftIdInput = ref([] as string[])
const nftIds = ref([] as string[])
const isVerifyingNFTId = ref(false)
const isAutoFetchingNFTId = ref(false)
const nftIdError = ref('')
const isEditingNFTId = ref(false)
const nftIdInputRef = ref<any[] | undefined>(undefined)

const orderInfo = ref<any>({})
const nftImage = ref('')

const isSendButtonDisabled = computed(() => isEditingNFTId.value || isLoading.value || isVerifyingNFTId.value || isAutoFetchingNFTId.value || !!nftIdError.value || isLimitReached.value)

const nftClassName = computed(() => nftStore.getClassMetadataById(classId.value as string)?.name)

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(isEditingNFTId, async (isEditing) => {
  if (isEditing) { return }

  if (nftIdInput.value) {
    const ids = nftIdInput.value.filter(id => id.trim() !== '')
    if (orderInfo.value.quantity && ids.length > 0 && ids.length !== orderInfo.value.quantity) {
      nftIdError.value = `Number of NFT IDs (${ids.length}) does not match the required quantity (${orderInfo.value.quantity})`
      nftIds.value = []
      return
    }
    nftIds.value = ids
    await fetchNFTMetadata()
  } else {
    nftImage.value = ''
    nftIds.value = []
  }
})

onMounted(async () => {
  const data = await $fetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/status/${paymentId.value}`,
    {
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
  orderInfo.value = (data as any)
  lazyFetchClassMetadataById(classId.value as string)
  fetchNextNFTId(orderInfo.value.quantity || 1)
})

function handleClickEditNFTId () {
  isEditingNFTId.value = !isEditingNFTId.value
  nftIdError.value = ''
  nextTick(() => {
    if (isEditingNFTId.value) {
      nftIdInputRef.value?.[0].$refs?.input?.focus()
    }
  })
}

async function fetchNFTMetadata () {
  try {
    isVerifyingNFTId.value = true
    if (!nftIds.value.length || !nftIds.value[0]) {
      nftImage.value = ''
      return
    }
    try {
      const data = await $fetch(`${LCD_URL}/cosmos/nft/v1beta1/nfts/${classId.value}/${nftIds.value[0]}`)
      const image = (data as any)?.nft?.data?.metadata?.image || ''
      nftImage.value = parseImageURLFromMetadata(image)
    } catch (err) {
      nftImage.value = ''
      if ((err as any)?.data?.code === 2) {
        nftIdError.value = 'NFT not found'
      } else {
        nftIdError.value = (err as Error).toString()
      }
    }
  } catch (err) {
    error.value = (err as Error).toString()
  } finally {
    isVerifyingNFTId.value = false
  }
}

async function fetchNextNFTId (count = 1) {
  try {
    nftIdError.value = ''
    isAutoFetchingNFTId.value = true
    if (!wallet.value || !signer.value) {
      await initIfNecessary()
    }
    if (!ownerWallet.value) { return }
    const { nfts } = await getNFTs({
      classId: classId.value,
      owner: ownerWallet.value,
      needCount: count
    })
    if (nfts.length) {
      nftIds.value = nfts.map(nft => nft.id)
      nftIdInput.value = nftIds.value
      await fetchNFTMetadata()
    } else {
      throw new Error(`${ownerWallet.value} does not hold any NFT of class ${classId.value}`)
    }
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
    if (nftIds.value) {
      const res = await Promise.all(nftIds.value.map(nftId => getNFTOwner(classId.value, nftId)))
      const owners = res.map((item: any) => item.owner)
      const mismatchNftIdIndex = owners.findIndex(owner => owner !== ownerWallet.value)
      if (mismatchNftIdIndex >= 0) {
        const mismatchNftId = nftIds.value[mismatchNftIdIndex]
        throw new Error(`NFT classId: ${classId.value} nftId:${mismatchNftId} is not owned by sender!`)
      }
    } else {
      await fetchNextNFTId(orderInfo.value.quantity || 1)
    }

    if (nftIds.value.length !== orderInfo.value.quantity) {
      throw new Error(`NFT quantity mismatch! Expected ${orderInfo.value.quantity}, got ${nftIds.value.length}`)
    }
    const signingClient = await getSigningClientWithSigner(signer.value)
    const client = signingClient.getSigningStargateClient()
    if (!client) { throw new Error('Signing client not exists') }

    const res = await signSendNFTs(
      orderInfo.value.wallet,
      Array(nftIds.value.length).fill(classId.value),
      nftIds.value,
      signer.value,
      wallet.value,
      memo.value
    )

    if (res.transactionHash && res.code === 0) {
      await $fetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/sent/${paymentId.value}`,
        {
          method: 'POST',
          body: {
            txHash: res.transactionHash,
            quantity: orderInfo.value.quantity || 1
          },
          headers: {
            authorization: `Bearer ${token.value}`
          }
        })

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

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
        <div class="flex flex-wrap items-center justify-center gap-2">
          <template v-if="orderInfo.quantity === 1">
            <UInput
              ref="nftIdInputRef"
              v-model="nftId"
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
            :label="`Auto-fetch NFT ID for ${orderInfo.quantity} NFTs`"
            :disabled="isLoading || isEditingNFTId"
            :loading="isAutoFetchingNFTId"
            variant="outline"
            @click="fetchNextNFTId"
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
import { DeliverTxResponse } from '@cosmjs/stargate'
import { storeToRefs } from 'pinia'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useNftStore } from '~/stores/nft'
import { parseImageURLFromMetadata } from '~/utils'
import { signExecNFTSendAuthz, signSendNFTs } from '~/utils/cosmos'

const AUTHOR_MESSAGE_LIMIT = 98

const { LIKE_CO_API, LCD_URL } = useRuntimeConfig().public

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
const nftIds = ref([] as string[])
const isVerifyingNFTId = ref(false)
const isAutoFetchingNFTId = ref(false)
const nftIdError = ref('')
const isEditingNFTId = ref(false)
const nftIdInputRef = ref<any>(undefined)

const orderInfo = ref<any>({})
const nftImage = ref('')

const userIsOwner = computed(() => wallet.value && ownerWallet.value === wallet.value)
const isSendButtonDisabled = computed(() => isEditingNFTId.value || isLoading.value || isVerifyingNFTId.value || isAutoFetchingNFTId.value || !!nftIdError.value || isLimitReached.value)

const nftClassName = computed(() => nftStore.getClassMetadataById(classId.value as string)?.name)
const messageCharCount = computed(() => {
  let count = 0
  for (let i = 0; i < memo.value.length; i++) {
    count += isFullWidthChar(memo.value[i]) ? 2 : 1
  }
  return count
})
const isLimitReached = computed(() => { return messageCharCount.value > AUTHOR_MESSAGE_LIMIT })

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(nftId, (newNftId) => {
  nftIdError.value = ''
  if (nftIds.value[0]) {
    nftIds.value[0] = newNftId
  }
})

watch(isEditingNFTId, async (isEditing) => {
  if (isEditing) { return }

  if (nftId.value) {
    await fetchNFTMetadata()
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
  fetchNextNFTId(orderInfo.value.quantity)
})

function handleClickEditNFTId () {
  isEditingNFTId.value = !isEditingNFTId.value
  nftIdError.value = ''
  nextTick(() => {
    if (isEditingNFTId.value) {
      nftIdInputRef.value?.$refs?.input?.focus()
    }
  })
}

async function fetchNFTMetadata () {
  try {
    isVerifyingNFTId.value = true
    const { data, error: fetchError } = await useFetch(`${LCD_URL}/cosmos/nft/v1beta1/nfts/${classId.value}/${nftId.value}`)
    if (fetchError.value) {
      nftImage.value = ''
      if (fetchError.value.data.code === 2) {
        nftIdError.value = 'NFT not found'
      } else {
        nftIdError.value = fetchError.value.toString()
      }
      return
    }
    const image = (data.value as any)?.nft?.data?.metadata?.image || ''
    nftImage.value = parseImageURLFromMetadata(image)
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
      await connect()
    }
    if (!ownerWallet.value) { return }
    const { nfts } = await getNFTs({
      classId: classId.value,
      owner: ownerWallet.value,
      needCount: count
    })
    if (nfts.length) {
      nftIds.value = nfts.map(nft => nft.id)
      nftId.value = nftIds.value[0]
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

async function onSendNFTStart () {
  if (isSendButtonDisabled.value) { return }
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await connect()
    }
    if (!wallet.value || !signer.value) { return }
    if (nftId.value) {
      const { owner } = await getNFTOwner(classId.value, nftId.value)
      if (owner !== ownerWallet.value) {
        throw new Error(`NFT classId: ${classId} nftId:${nftId} is not owned by sender!`)
      }
    } else {
      await fetchNextNFTId(orderInfo.quantity)
    }

    const signingClient = await getSigningClientWithSigner(signer.value)
    const client = signingClient.getSigningStargateClient()
    if (!client) { throw new Error('Signing client not exists') }

    let res: DeliverTxResponse | undefined
    if (userIsOwner.value) {
      res = await signSendNFTs(
        orderInfo.value.wallet,
        Array(nftIds.value.length).fill(classId.value),
        nftIds.value,
        signer.value,
        wallet.value,
        memo.value
      )
    } else {
      res = await signExecNFTSendAuthz(
        orderInfo.value.wallet,
        ownerWallet.value,
        Array(nftIds.value.length).fill(classId.value),
        nftIds.value,
        signer.value,
        wallet.value,
        memo.value
      )
    }

    if (res.transactionHash && res.code === 0) {
      const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/sent/${paymentId.value}`,
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

function isFullWidthChar (char: any) {
  return char.charCodeAt(0) > 255
}

</script>

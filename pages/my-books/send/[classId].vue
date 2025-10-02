<template>
  <PageBody>
    <h1 class="text-lg font-bold font-mono">
      Deliver NFT Book "{{ nftClassName || classId }}"
    </h1>

    <UAlert
      v-if="error.message"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error.message}`"
      :actions="error.actions"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = { message: '', actions: [] }"
    />

    <UProgress v-if="isLoading" animation="carousel">
      <template #indicator>
        Loading...
      </template>
    </UProgress>

    <UCard
      v-if="bookstoreApiStore.isAuthenticated"
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
                {{ $t('table.buyer_email') }}
              </th><td class="px-4 py-3">
                {{ orderInfo.email }}
              </td>
            </tr>
            <tr>
              <th class="text-left px-4 py-3">
                {{ $t('table.reader_email') }}
              </th><td class="px-4 py-3">
                {{ orderInfo.giftInfo?.toEmail || orderInfo.email }}
              </td>
            </tr>
            <tr>
              <th class="text-left px-4 py-3">
                {{ $t('table.status') }}
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
                {{ $t('table.price_name') }}
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
            :label="$t('button.check_all_nft_ids')"
            :disabled="isLoading || isEditingNFTId"
            variant="outline"
            @click="onCheckOwnedIds"
          />
        </div>
      </UFormGroup>

      <PlaceholderCard class="h-[300px]">
        <img
          v-if="nftImage"
          class="max-w-[180px] w-full h-full object-contain"
          alt="preview"
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
    <UModal v-model="showRestockModal">
      <LiteMintNFT
        :is-restock="true"
        :iscn-id="classId"
        @submit="handleFinishRestock"
      />
    </UModal>
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWriteContract } from '@wagmi/vue'
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useNftStore } from '~/stores/nft'
import { parseImageURLFromMetadata } from '~/utils'
import { useMessageCharCount } from '~/composables/useMessageCharCount'
import { AUTHOR_MESSAGE_LIMIT } from '~/constant'
import { LIKE_NFT_CLASS_ABI } from '~/contracts/likeNFT'

const { LIKE_CO_API } = useRuntimeConfig().public

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { initIfNecessary } = store

const bookstoreApiStore = useBookstoreApiStore()
const { token } = storeToRefs(bookstoreApiStore)

const nftStore = useNftStore()
const { lazyFetchClassMetadataById } = nftStore

const route = useRoute()
const localeRoute = useLocaleRoute()

const { writeContractAsync } = useWriteContract()
const { getBalanceOf, getTokenIdByOwnerIndex } = useNFTContractReader()
const { assertPositiveWalletBalance, waitForTransactionReceipt } = useNFTContractWriter()

const error = ref({ message: '', actions: [{}] })
const isLoading = ref(false)
const classId = ref(route.params.classId as string)
const paymentId = ref(route.query.payment_id as string)
const ownerWallet = ref(route.query.owner_wallet as string || wallet.value)
const memo = ref('')
const { messageCharCount, isLimitReached } = useMessageCharCount(memo, AUTHOR_MESSAGE_LIMIT)
const { getNFTMetadata, getNFTOwner } = useNFTContractReader()

const nftIdInput = ref([] as string[])
const nftIds = ref([] as number[])
const isVerifyingNFTId = ref(false)
const isAutoFetchingNFTId = ref(false)
const nftIdError = ref('')
const isEditingNFTId = ref(false)
const nftIdInputRef = ref<any[] | undefined>(undefined)

const orderInfo = ref<any>({})
const nftImage = ref('')

const showRestockModal = ref(false)

const { OPENSEA_ITEM_URL } = useRuntimeConfig().public
const isSendButtonDisabled = computed(() => isEditingNFTId.value || isLoading.value || isVerifyingNFTId.value || !!nftIdError.value || isLimitReached.value)

const nftClassName = computed(() => nftStore.getClassMetadataById(classId.value as string)?.name)

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value.message = '' }
})

watch(isEditingNFTId, async (isEditing) => {
  if (isEditing) { return }

  if (nftIdInput.value) {
    const ids = nftIdInput.value.filter(id => id.trim() !== '').map(id => Number(id))
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
    if (!nftIds.value.length || nftIds.value[0] === undefined) {
      nftImage.value = ''
      return
    }
    try {
      const metadata = await getNFTMetadata(classId.value, nftIds.value[0])
      nftImage.value = parseImageURLFromMetadata(metadata?.image)
    } catch (err) {
      nftImage.value = ''
      if ((err as any)?.data?.code === 2) {
        nftIdError.value = 'NFT not found'
      } else {
        nftIdError.value = (err as Error).toString()
      }
    }
  } catch (err) {
    error.value.message = (err as Error).toString()
  } finally {
    isVerifyingNFTId.value = false
  }
}

async function fetchNextNFTId (_count = 1) {
  try {
    nftIds.value = []
    nftIdError.value = ''
    isAutoFetchingNFTId.value = true
    if (!wallet.value || !signer.value) {
      await initIfNecessary()
    }
    if (!ownerWallet.value) { return }
    const balance = await getBalanceOf(classId.value, ownerWallet.value) as bigint
    if (Number(balance) < _count) {
      throw new Error(`Insufficient balance of NFT classId: ${classId.value} for wallet: ${ownerWallet.value}`)
    }

    for (let i = 0; i < _count; i++) {
      let nextNftId = await getTokenIdByOwnerIndex(classId.value, ownerWallet.value, i)
      if (Number(nextNftId) === 0) {
        // NFT ID 0 is reserved for the author, skip it
        if (balance <= BigInt(i + 1)) {
          throw new Error(`Insufficient balance of NFT classId: ${classId.value} for wallet: ${ownerWallet.value}`)
        }
        nextNftId = 1
      }
      nftIds.value.push(Number(nextNftId))
    }
    nftIdInput.value = nftIds.value.map(id => id.toString())
    await fetchNFTMetadata()
  } catch (err) {
    error.value.message = (err as Error).toString()
    error.value.actions = [
      {
        label: $t('button.restock_nft'),
        variant: 'outline',
        color: 'red',
        click: () => {
          showRestockModal.value = true
        }
      }
    ]
  }
}

function onCheckOwnedIds () {
  window.open(`${OPENSEA_ITEM_URL}/${classId.value}`, '_blank', 'noopener')
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
      const owners = await Promise.all(nftIds.value.map(nftId => getNFTOwner(classId.value, nftId)))
      const mismatchNftIdIndex = owners.findIndex(owner => owner !== ownerWallet.value)
      if (mismatchNftIdIndex >= 0) {
        const mismatchNftId = nftIds.value[mismatchNftIdIndex]
        throw new Error(`NFT classId: ${classId.value} nftId:${mismatchNftId} is not owned by sender!`)
      }
    } else {
      await fetchNextNFTId(orderInfo.value.quantity)
    }

    await assertPositiveWalletBalance({
      wallet: wallet.value
    })
    const txHash = await writeContractAsync({
      address: classId.value as any,
      abi: LIKE_NFT_CLASS_ABI,
      functionName: 'batchTransferWithMemo',
      args: [
        wallet.value,
        Array(orderInfo.value.quantity).fill(orderInfo.value.wallet),
        nftIds.value,
        Array(orderInfo.value.quantity).fill(memo.value)
      ]
    })
    const receipt = await waitForTransactionReceipt({ hash: txHash })
    if (receipt?.status === 'success') {
      await $fetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/sent/${paymentId.value}`,
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

      await navigateTo(localeRoute({
        name: 'my-books-status-classId',
        params: {
          classId: classId.value
        }
      }))
    }
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

function handleFinishRestock () {
  showRestockModal.value = false
  fetchNextNFTId(orderInfo.value.quantity || 1)
}

</script>

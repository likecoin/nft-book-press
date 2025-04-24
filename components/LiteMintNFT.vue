<template>
  <div class="flex flex-col items-stretch grow space-y-4">
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />

    <UCard
      class="flex-1"
      :ui="{ body: { base: 'space-y-4' } }"
    >
      <template #header>
        <h3 class="font-bold">
          Mint NFT by filling required information
        </h3>
      </template>

      <NFTMintForm
        ref="formRef"
        v-model="formState"
        :max-supply="classMaxSupply"
        :show-max-supply="false"
      />

      <div v-if="isLoading" class="w-full">
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <UBadge color="Badge" variant="soft">
              Minting NFT
            </UBadge>
            <p class="text-xs text-gray-500">
              請勿關閉此視窗，直到操作完成。
            </p>
          </div>
          <UProgress
            animation="carousel"
            color="primary"
            class="w-full"
          />
        </div>
      </div>
      <div class="flex justify-center">
        <UButton
          label="Submit"
          :loading="isLoading"
          size="lg"
          :disabled="isLoading"
          @click="onClickMintByInputting"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

import { useWalletStore } from '~/stores/wallet'
import { convertArrayOfObjectsToCSV } from '~/utils'
import { NFT_DEFAULT_MINT_AMOUNT } from '~/constant'

const route = useRoute()
const toast = useToast()

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { initIfNecessary } = store

const error = ref('')
const isLoading = ref(false)

const iscnData = ref<any>(null)

const classData = ref<any>(null)
const classMaxSupply = ref<number | undefined>(undefined)
const classCreateData = ref<any>(null)

const nftMintListData = ref<any>([])
const nftMintDefaultData = ref<any>(null)
const nftData = ref<any>(null)
const nftCSVData = ref('')
const existingNftCount = ref(0)

const classId = ref<string>(route.params.classId as string)

const formState = reactive({
  prefix: 'BOOKSN',
  mintCount: NFT_DEFAULT_MINT_AMOUNT,
  imageUrl: '',
  externalUrl: '',
  uri: '',
  maxSupply: undefined
})

const formRef = ref()
const { LCD_URL } = useRuntimeConfig().public

const isFormValid = computed(() => {
  return formRef.value?.validate(formState).length === 0
})

const emit = defineEmits(['submit'])
const iscnId = ref('')

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

function generateNFTMintListCSVData ({
  prefix,
  nftExisitngCount = 0,
  nftMintCount,
  imgUrl,
  uri
}: {
  prefix: string;
  nftExisitngCount?: number;
  nftMintCount: number;
  imgUrl: string;
  uri: string ;
}) {
  const csvRows = []
  for (let i = nftExisitngCount; i <= nftExisitngCount + nftMintCount - 1; i++) {
    const nftId = `${prefix}-${i.toString().padStart(4, '0')}`
    csvRows.push({
      nftId,
      uri,
      image: imgUrl,
      metadata: ''
    })
  }
  return convertArrayOfObjectsToCSV(csvRows)
}

async function onClickMintByInputting () {
  try {
    isLoading.value = true
    const { contentMetadata } = iscnData.value

    if (!isFormValid.value) {
      toast.add({
        icon: 'i-heroicons-exclamation-circle',
        title: `Required field missing: ${error.value}`,
        timeout: 3000,
        color: 'red'
      })
      return
    }

    const nftClassData = {
      name: contentMetadata.name,
      description: contentMetadata.description,
      symbol: 'BOOK',
      uri: formState.uri || '',
      metadata: {
        name: contentMetadata.name,
        image: formState.imageUrl,
        external_url: formState.externalUrl,
        nft_meta_collection_id: 'nft_book',
        nft_meta_collection_name: 'NFT Book',
        nft_meta_collection_description: 'NFT Book by Liker Land'
      }
    }
    const nftsDefaultData = {
      uri: formState.uri || '',
      metadata: {
        name: contentMetadata.name,
        image: formState.imageUrl,
        external_url: formState.externalUrl
      }
    }
    const { nfts } = await getNFTs({ classId: classId.value as string })
    existingNftCount.value = nfts.length
    if (typeof formState.mintCount !== 'number') {
      formState.mintCount = Number(formState.mintCount)
    }
    const csvDataString = generateNFTMintListCSVData({
      prefix: formState.prefix,
      nftMintCount: formState.mintCount,
      nftExisitngCount: existingNftCount.value,
      imgUrl: formState.imageUrl,
      uri: formState.uri
    })
    const csvDataArray = parse(csvDataString, { columns: true })

    classCreateData.value = nftClassData
    nftMintDefaultData.value = nftsDefaultData
    nftMintListData.value = csvDataArray
    formState.mintCount = csvDataArray.length

    await onMintNFTStart()
    emit('submit')
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function onMintNFTStart () {
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await initIfNecessary()
    }
    if (!wallet.value || !signer.value) { return }
    if (!nftMintDefaultData.value) { throw new Error('NO_MINT_DATA') }
    if (nftMintListData.value.length && nftMintListData.value.length !== formState.mintCount) {
      throw new Error(`NFT csv data length ${nftMintListData.value.length} must match nft mint amount ${formState.mintCount}`)
    }
    const defaultURI = nftMintDefaultData.value.uri
    const defaultMetadata = nftMintDefaultData.value.metadata
    const nfts = [...Array(formState.mintCount).keys()].map((i) => {
      const {
        nftId,
        uri: dataUri,
        image: dataImage,
        metadata: dataMetadataString,
        ...otherData
      } = nftMintListData?.value?.[i] || {}
      const dataMetadata = JSON.parse(dataMetadataString || '{}')
      const data = { ...defaultMetadata, ...dataMetadata }
      if (dataImage) { data.image = dataImage }
      Object.entries(otherData).forEach(([key, value]) => {
        if (value) {
          try {
            data[key] = JSON.parse(value as string)
          } catch (err) {
            data[key] = value
          }
        }
      })
      const id = nftId || `nft-${uuidv4()}`
      let uri = dataUri || defaultURI || ''
      const isUriHttp = uri && uri.startsWith('https://')
      if (isUriHttp) { uri = addParamToUrl(uri, { class_id: classId.value, nft_id: id }) }
      return {
        id,
        uri,
        metadata: data
      }
    })
    nftCSVData.value = stringify(nfts, { header: true })
    const res = await signMintNFT(
      nfts,
      classId.value,
      signer.value,
      wallet.value
    )
    nftData.value = res
    return classData.value
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

async function onISCNIDInput (value: string) {
  isLoading.value = true
  try {
    iscnId.value = value
    const resISCN = await $fetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(iscnId.value)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const { records } = resISCN as any
    iscnData.value = records[0].data
    formState.imageUrl = iscnData.value.contentMetadata?.thumbnailUrl || ''
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  isLoading,
  isFormValid,
  onISCNIDInput,
  onClickMintByInputting
})

</script>

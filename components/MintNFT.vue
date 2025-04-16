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

    <ISCNInfoCard
      :iscn-id="iscnId"
      :iscn-owner="iscnOwner"
      :iscn-data="iscnData"
      :show-edit-button="true"
      @edit="showEditISCNModal = true"
    />

    <UCard
      v-if="step === 2 || step === 3"
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
        :show-max-supply="isCreatingClass"
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
      <EditISCNMetadataModal
        ref="editISCNRef"
        v-model="showEditISCNModal"
        :class-id="classId"
        @save="onSaveISCN"
      />
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

const { LCD_URL } = useRuntimeConfig().public
const router = useRouter()
const route = useRoute()
const toast = useToast()

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { initIfNecessary } = store

const step = ref(1)
const error = ref('')
const isLoading = ref(false)

const iscnIdInput = ref('')
const iscnOwner = ref('')
const iscnData = ref<any>(null)

const classData = ref<any>(null)
const classMaxSupply = ref<number | undefined>(undefined)
const classCreateData = ref<any>(null)

const nftMintListData = ref<any>([])
const nftMintDefaultData = ref<any>(null)
const nftMintCount = ref(NFT_DEFAULT_MINT_AMOUNT)
const nftData = ref<any>(null)
const nftCSVData = ref('')
const existingNftCount = ref(0)

const iscnId = computed(() => iscnData.value?.['@id'])
const classId = computed(() => classData.value?.id)
const isCreatingClass = computed(() => !classId.value && step.value === 2)

const formState = reactive({
  prefix: 'BOOKSN',
  mintCount: NFT_DEFAULT_MINT_AMOUNT,
  imageUrl: '',
  externalUrl: '',
  uri: '',
  maxSupply: undefined
})

const formRef = ref()

const isFormValid = computed(() => {
  return formRef.value?.validate(formState).length === 0
})

const emit = defineEmits(['submit'])
const showEditISCNModal = ref(false)
const editISCNRef = ref<any>(null)

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(iscnData, (recordData) => {
  if (recordData) {
    formState.imageUrl = recordData.contentMetadata?.thumbnailUrl || ''
  }
})

useSeoMeta({
  title: 'Mint Liker Land NFT Book',
  ogTitle: 'Mint Liker Land NFT Book'
})

async function onISCNIDInput (iscnId?: string) {
  if (iscnId) {
    iscnIdInput.value = iscnId
  }
  try {
    isLoading.value = true
    if (iscnIdInput.value.startsWith('iscn://')) {
      const data = await $fetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(iscnIdInput.value)}`)
      const { records, owner } = data as any
      iscnData.value = records[0].data
      iscnOwner.value = owner
      step.value = 2
    }
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

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
  if (!isCreatingClass.value) {
    const { nfts } = await getNFTs({ classId: classId.value as string })
    existingNftCount.value = nfts.length
  }
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

  try {
    if (step.value === 2) {
      await onClassFileInput() // step=3
    }
    const classData = await onMintNFTStart() // step=4
    emit('submit', {
      classId: classData.id,
      nftMintCount: formState.mintCount
    })
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function onClassFileInput () {
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await initIfNecessary()
    }
    if (!wallet.value || !signer.value) { return }
    if (!classCreateData.value) { throw new Error('NO_CLASS_DATA') }
    if (iscnOwner.value !== wallet.value) { throw new Error('INVALID_OWNER') }
    const newClassId = await signCreateNFTClass(classCreateData.value, iscnId.value, signer.value, wallet.value, { nftMaxSupply: classMaxSupply.value })
    await signCreateRoyltyConfig(newClassId, iscnData.value, iscnOwner.value, false, signer.value, wallet.value)
    const data = await $fetch(`${LCD_URL}/cosmos/nft/v1beta1/classes/${encodeURIComponent(newClassId)}`)
    if (!data) { throw new Error('INVALID_NFT_CLASS_ID') }
    classData.value = (data as any).class
    step.value = 3
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
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
    if (nftMintListData.value.length && nftMintListData.value.length !== nftMintCount.value) {
      throw new Error(`NFT csv data length ${nftMintListData.value.length} must match nft mint amount ${nftMintCount.value}`)
    }
    const defaultURI = nftMintDefaultData.value.uri
    const defaultMetadata = nftMintDefaultData.value.metadata
    const nfts = [...Array(nftMintCount.value).keys()].map((i) => {
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

function onSaveISCN () {
  const iscnId = editISCNRef.value?.iscnId
  if (iscnId) {
    router.replace({ query: { ...route.query, iscn_id: iscnId } })
    onISCNIDInput(iscnId)
  } else {
    window.location.reload()
  }
}

defineExpose({
  isFormValid,
  onISCNIDInput,
  onClickMintByInputting
})

</script>

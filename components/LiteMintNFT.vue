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
      <div v-if="shouldShowSubmit" class="flex justify-center">
        <UButton
          label="Submit"
          :loading="isLoading"
          size="lg"
          :disabled="isLoading"
          @click="startNFTMintFlow"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

import { useWalletStore } from '~/stores/wallet'
import { NFT_DEFAULT_MINT_AMOUNT } from '~/constant'
import { useToastComposable } from '~/composables/useToast'

const route = useRoute()

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { initIfNecessary } = store

const error = ref('')
const isLoading = ref(false)

const iscnData = ref<any>(null)
const localISCNId = ref('')

const classMaxSupply = ref<number | undefined>(undefined)
const classCreateData = ref<any>(null)

const nftMintListData = ref<any>([])
const nftMintDefaultData = ref<any>(null)
const existingNftCount = ref(0)

const classId = ref<string>(route.params.classId as string || '')

const iscnOwner = computed(() => iscnData.value?.owner || '')

const formState = reactive({
  prefix: 'BOOKSN',
  mintCount: NFT_DEFAULT_MINT_AMOUNT,
  imageUrl: '',
  externalUrl: '',
  uri: '',
  maxSupply: undefined
})

const { LCD_URL } = useRuntimeConfig().public
const emit = defineEmits(['submit', 'formValidChange'])
const { showErrorToast } = useToastComposable()

const formError = computed(() => {
  const requiredFields = {
    prefix: !!formState.prefix,
    mintCount: !!formState.mintCount,
    imageUrl: !!formState.imageUrl
  }

  return Object.entries(requiredFields)
    .filter(([_, isValid]) => !isValid)
    .map(([key]) => key.toUpperCase())
})

const isFormValid = computed(() => !formError.value?.length)

watch(isFormValid, (val: boolean) => {
  emit('formValidChange', val)
}, { immediate: true })

const isCreateClass = computed(() => {
  return !classId.value
})
watch(isLoading, (val: boolean) => {
  if (val) {
    error.value = ''
  }
}, { immediate: true })

const props = defineProps({
  iscnData: {
    type: Object,
    default: null
  },
  shouldShowSubmit: {
    type: Boolean,
    default: true
  },
  iscnId: {
    type: String,
    default: ''
  }
})

watchEffect(async () => {
  if (props.iscnData) {
    iscnData.value = props.iscnData
    localISCNId.value = props.iscnData['@id']
    formState.imageUrl = props.iscnData.contentMetadata?.thumbnailUrl || ''
  } else if (props.iscnId) {
    await fetchISCNById(props.iscnId)
  }
})

async function onClassFileInput () {
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await initIfNecessary()
    }
    if (!wallet.value || !signer.value) { return }
    if (!classCreateData.value) { throw new Error('NO_CLASS_DATA') }
    if (iscnOwner.value !== wallet.value) { throw new Error('INVALID_OWNER') }
    const newClassId = await signCreateNFTClass(classCreateData.value, localISCNId.value, signer.value, wallet.value, { nftMaxSupply: classMaxSupply.value })
    await signCreateRoyltyConfig(newClassId, iscnData.value, iscnOwner.value, false, signer.value, wallet.value)
    const data = await $fetch(`${LCD_URL}/cosmos/nft/v1beta1/classes/${encodeURIComponent(newClassId)}`)
    if (!data) { throw new Error('INVALID_NFT_CLASS_ID') }
    const classData = (data as any).class

    return classData
  } finally {
    isLoading.value = false
  }
}

function generateNFTMintListData ({
  prefix,
  nftExistingCount = 0,
  nftMintCount,
  imgUrl,
  uri
}: {
  prefix: string;
  nftExistingCount?: number;
  nftMintCount: number;
  imgUrl: string;
  uri: string ;
}) {
  const dataRows = []
  for (let i = nftExistingCount; i <= nftExistingCount + nftMintCount - 1; i++) {
    const nftId = `${prefix}-${i.toString().padStart(4, '0')}`
    dataRows.push({
      nftId,
      uri,
      image: imgUrl,
      metadata: ''
    })
  }
  return dataRows
}

async function startNFTMintFlow () {
  try {
    isLoading.value = true
    const { contentMetadata } = iscnData.value

    if (!isFormValid.value) {
      const missingFields = formError.value.join(', ')
      showErrorToast(`Required field missing: ${missingFields}`)
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
    if (!isCreateClass.value) {
      const { nfts } = await getNFTs({ classId: classId.value as string })
      existingNftCount.value = nfts.length
    }

    if (typeof formState.mintCount !== 'number') {
      formState.mintCount = Number(formState.mintCount)
    }

    classCreateData.value = nftClassData
    nftMintDefaultData.value = nftsDefaultData
    nftMintListData.value = generateNFTMintListData({
      prefix: formState.prefix,
      nftMintCount: formState.mintCount,
      nftExistingCount: existingNftCount.value,
      imgUrl: formState.imageUrl,
      uri: formState.uri
    })
    formState.mintCount = nftMintListData.value.length

    if (isCreateClass.value) {
      const classData = await onClassFileInput()
      classId.value = classData.id
    }
    if (!classId.value) {
      throw new Error('INVALID_CLASS_ID')
    }
    await mintNFTs()
    if (classId.value) {
      emit('submit', {
        classId: classId.value,
        nftMintCount: formState.mintCount,
        prefix: formState.prefix
      })
    } else {
      emit('submit')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    showErrorToast(`Mint NFT error: ${(error as Error).toString()}`)
  } finally {
    isLoading.value = false
  }
}

async function mintNFTs () {
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await initIfNecessary()
    }
    if (!wallet.value || !signer.value) { return }
    if (!nftMintDefaultData.value) { throw new Error('NO_MINT_DATA') }
    const defaultURI = nftMintDefaultData.value.uri
    const defaultMetadata = nftMintDefaultData.value.metadata
    const nfts = [...Array(formState.mintCount).keys()].map((i) => {
      const {
        nftId,
        uri: dataUri,
        image: dataImage,
        ...otherData
      } = nftMintListData?.value?.[i] || {}
      const data = { ...defaultMetadata }
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
    await signMintNFT(
      nfts,
      classId.value,
      signer.value,
      wallet.value
    )
  } finally {
    isLoading.value = false
  }
}

async function fetchISCNById (iscnId: string) {
  isLoading.value = true
  try {
    const resISCN = await $fetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(iscnId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const { records } = resISCN as any
    const data = records[0].data

    localISCNId.value = iscnId
    iscnData.value = data
    formState.imageUrl = data?.contentMetadata?.thumbnailUrl || ''
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

defineExpose({
  startNFTMintFlow
})

</script>

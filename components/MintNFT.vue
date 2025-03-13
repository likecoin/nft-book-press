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
      :ui="{ body: { base: 'space-y-4' } }"
    >
      <template #header>
        <h2 class="font-bold font-mono">
          ISCN Information
        </h2>
      </template>

      <UFormGroup label="ISCN ID" class="text-left">
        <UButton
          class="font-mono"
          :label="iscnId"
          :to="`${appLikeCoURL}/view/${encodeURIComponent(iscnId)}`"
          target="_blank"
          variant="link"
          :padded="false"
        />
      </UFormGroup>

      <UFormGroup label="ISCN Owner" class="text-left">
        <UButton
          :label="iscnOwner"
          :to="`${likerLandURL}/${encodeURIComponent(iscnOwner)}`"
          target="_blank"
          variant="link"
          :padded="false"
        />
      </UFormGroup>

      <UFormGroup label="ISCN Title">
        <UInput
          :value="iscnData?.contentMetadata?.name"
          :readonly="true"
          variant="none"
          :padded="false"
        />
      </UFormGroup>
      <UFormGroup label="ISCN Description">
        <UInput
          :value="iscnData?.contentMetadata?.description"
          :readonly="true"
          variant="none"
          :padded="false"
        />
      </UFormGroup>
      <UButton
        label="Edit ISCN Metadata"
        @click="showEditISCNModal = true"
      />
    </UCard>

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
      <UForm :validate="validate" :state="state" class="flex flex-col gap-[12px]">
        <UFormGroup label="NFT ID Prefix / 前綴（書本編號）" name="prefix" required>
          <UInput v-model="state.nftIdPrefix" placeholder="English only ex.MoneyVerse" />
        </UFormGroup>

        <UFormGroup label="Number of NFT to mint / 鑄造數量（此批）" required>
          <UInput
            v-model="nftMintCount"
            placeholder="0-100"
            type="number"
            :min="0"
            :max="classMaxSupply"
          />
        </UFormGroup>

        <UFormGroup label="Image URL / 封面網址" required>
          <UInput v-model="imageUrl" placeholder="ipfs:// ... or ar://...." />
        </UFormGroup>
        <div class="flex justify-center items-center">
          <h3 class="font-bold font-mono text-[14px]">
            Advanced Settings
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            :icon="
              shouldShowAdvanceSettings
                ? 'i-heroicons-chevron-up'
                : 'i-heroicons-chevron-down'
            "
            @click="
              () => {
                shouldShowAdvanceSettings = !shouldShowAdvanceSettings;
              }
            "
          />
        </div>

        <template v-if="shouldShowAdvanceSettings">
          <UFormGroup label="External URL (optional) / 外部網址（選填）">
            <UInput v-model="externalUrl" placeholder="https://" />
          </UFormGroup>

          <UFormGroup label="URI (optional) / 元資料網址（選填）">
            <UInput v-model="uri" placeholder="https://" />
          </UFormGroup>

          <UFormGroup v-if="isCreatingClass" label="Max number of supply for this NFT Class (optional) / 最大供應量（選填）">
            <template
              v-if="classMaxSupply && classMaxSupply < nftMintCount"
              #help
            >
              <UAlert
                class="mt-1"
                icon="i-heroicons-exclamation-triangle"
                title="Should be more than number of NFT to mint"
                color="red"
                variant="subtle"
              />
            </template>
            <UInput
              v-model="classMaxSupply"
              type="number"
              :min="nftMintCount"
              :placeholder="`> ${nftMintCount}`"
            />
          </UFormGroup>
        </template>
      </UForm>
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
import type { FormError } from '#ui/types'

import { useWalletStore } from '~/stores/wallet'
import { convertArrayOfObjectsToCSV } from '~/utils'
import { NFT_DEFAULT_MINT_AMOUNT } from '~/constant'

const { LCD_URL, APP_LIKE_CO_URL, LIKER_LAND_URL } = useRuntimeConfig().public
const router = useRouter()
const route = useRoute()
const toast = useToast()

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { initIfNecessary } = store

const appLikeCoURL = APP_LIKE_CO_URL
const likerLandURL = LIKER_LAND_URL
const step = ref(1)
const error = ref('')
const isLoading = ref(false)

const iscnIdInput = ref('')
const iscnOwner = ref('')
const iscnData = ref<any>(null)
const state = reactive({
  nftIdPrefix: 'BOOKSN'
})
const hasError = ref(false)
const imageUrl = ref('')
const externalUrl = ref('')
const uri = ref('')

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

const shouldShowAdvanceSettings = ref(false)

const isFormValid = computed(() => {
  const requiredFields = {
    prefix: state.nftIdPrefix,
    nftMintCount: nftMintCount.value,
    imageUrl: imageUrl.value
  }

  error.value = Object.entries(requiredFields)
    .find(([_, isValid]) => !isValid)?.[0]
    ?.toUpperCase() || ''

  return Object.values(requiredFields).every(Boolean)
})

const emit = defineEmits(['submit'])
const showEditISCNModal = ref(false)
const editISCNRef = ref<any>(null)

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(iscnData, (recordData) => {
  if (recordData) {
    imageUrl.value = recordData.contentMetadata?.thumbnailUrl || ''
  }
})

useSeoMeta({
  title: 'Mint Liker Land NFT Book',
  ogTitle: 'Mint Liker Land NFT Book'
})

const validate = (state: any): FormError[] => {
  hasError.value = false
  const errors = []
  const whitespaceRegex = /^[a-zA-Z][a-zA-Z0-9/:-]{2,100}$/

  if (!whitespaceRegex.test(state.nftIdPrefix)) {
    hasError.value = true
    errors.push({ path: 'prefix', message: 'NFT ID cannot contain spaces' })
  }
  return errors
}

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
    uri: uri.value || '',
    metadata: {
      name: contentMetadata.name,
      image: imageUrl.value,
      external_url: externalUrl.value,
      nft_meta_collection_id: 'nft_book',
      nft_meta_collection_name: 'NFT Book',
      nft_meta_collection_description: 'NFT Book by Liker Land'
    }
  }
  const nftsDefaultData = {
    uri: uri.value || '',
    metadata: {
      name: contentMetadata.name,
      image: imageUrl.value,
      external_url: externalUrl.value
    }
  }
  if (!isCreatingClass.value) {
    const { nfts } = await getNFTs({ classId: classId.value as string })
    existingNftCount.value = nfts.length
  }
  if (typeof nftMintCount.value !== 'number') {
    nftMintCount.value = Number(nftMintCount.value)
  }
  const csvDataString = generateNFTMintListCSVData({
    prefix: state.nftIdPrefix,
    nftMintCount: nftMintCount.value,
    nftExisitngCount: existingNftCount.value,
    imgUrl: imageUrl.value,
    uri: uri.value
  })
  const csvDataArray = parse(csvDataString, { columns: true })

  classCreateData.value = nftClassData
  nftMintDefaultData.value = nftsDefaultData
  nftMintListData.value = csvDataArray
  nftMintCount.value = csvDataArray.length

  try {
    if (step.value === 2) {
      await onClassFileInput() // step=3
    }
    const classData = await onMintNFTStart() // step=4
    emit('submit', {
      classId: classData.id,
      nftMintCount: nftMintCount.value
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
  const currentVersion = editISCNRef.value?.recordVersion
  if (iscnId) {
    router.replace({ query: { ...route.query, iscn_id: `${iscnId}/${currentVersion + 1}` } })
    iscnIdInput.value = `${iscnId}/${currentVersion + 1}`
    step.value = 1
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

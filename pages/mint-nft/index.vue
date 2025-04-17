<template>
  <PageContainer :key="route.path">
    <PageHeader title="Mint Liker Land NFT Book" />

    <PageBody class="flex flex-col items-stretch grow space-y-4">
      <AuthRequiredView>
        <UAlert
          v-if="error"
          icon="i-heroicons-exclamation-triangle"
          color="red"
          variant="soft"
          :title="`${error}`"
          :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
          @close="error = ''"
        />
        <UAlert
          v-else
          icon="i-heroicons-exclamation-circle"
          color="green"
          variant="soft"
          title="First time? 新用戶請看這裏"
          description="Read our guide to learn how to publish NFT Book."
          :actions="[{
            label: 'Read our guide',
            color: 'green',
            variant: 'outline',
            click: onClickHelpEn,
          }, {
            label: '打開教學',
            color: 'green',
            variant: 'outline',
            click: onClickHelpZh,
          },{
            label: 'Listing Disclaimer',
            color: 'green',
            variant: 'outline',
            click: onClickDisclaimerEn,
          },{
            label: '上架須知和收費',
            color: 'green',
            variant: 'outline',
            click: onClickDisclaimerZh,
          }]"
        />
        <UDivider :label="`Steps ${step} / 4`" />

        <UCard
          v-if="step === 1"
          :ui="{ body: { base: 'space-y-4' } }"
        >
          <template #header>
            <h2 class="font-bold font-mono">
              1. Select or Create ISCN
            </h2>
          </template>

          <UCard
            v-if="!iscnCreateData"
            :ui="{ body: { base: 'space-y-4' } }"
          >
            <UFormGroup label="Enter ISCN ID or NFT Class ID">
              <UInput
                v-model="iscnIdInput"
                class="font-mono"
                placeholder="iscn://... or likenft...."
              />
            </UFormGroup>

            <UButton
              type="submit"
              label="Submit"
              :disabled="isLoading || !(iscnIdInput)"
              @click="onISCNIDInput"
            />
          </UCard>
        </UCard>
        <UCard
          v-else-if="step > 1"
          :ui="{ body: { base: 'space-y-4' } }"
        >
          <template #header>
            <h2 class="font-bold font-mono">
              ISCN Information
            </h2>
          </template>

          <UFormGroup label="ISCN ID">
            <UButton
              class="font-mono"
              :label="iscnId"
              :to="`${appLikeCoURL}/view/${encodeURIComponent(iscnId)}`"
              target="_blank"
              variant="link"
              :padded="false"
            />
          </UFormGroup>

          <UFormGroup label="ISCN Owner">
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
          :ui="{ body: { base: 'space-y-4' } }"
        >
          <template #header>
            <h2 class="font-bold font-mono">
              {{ step }}. {{ isCreatingClass ? 'Create NFT Class' : 'Mint NFT' }}
            </h2>
          </template>

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
              v-model="state"
              :max-supply="classMaxSupply"
              :show-max-supply="isCreatingClass"
            />

            <template #footer>
              <UButton
                label="Mint"
                :disabled="isLoading || !(state.prefix && state.mintCount && state.imageUrl) || !isFormValid"
                @click="onClickMintByInputting"
              />
            </template>
          </UCard>
        </UCard>

        <UCard v-else-if="step > 2 && classId">
          <template #header>
            <h3>NFT Class Information</h3>
          </template>

          <UFormGroup label="NFT Class ID">
            <UButton
              :label="classId"
              :to="`${likerLandURL}/nft/class/${encodeURIComponent(classId)}`"
              target="_blank"
              variant="link"
              :padded="false"
            />
          </UFormGroup>
        </UCard>

        <UCard
          v-if="step > 3"
          :ui="{
            header: { base: 'font-bold font-mono' },
            body: { base: 'flex flex-wrap items-center justify-center gap-2' },
            footer: { base: 'flex flex-wrap items-center justify-end gap-2' },
          }"
        >
          <template #header>
            🎉 Success!
          </template>

          <UButton
            label="Download NFT result csv"
            :disabled="isLoading"
            variant="outline"
            @click="onDownloadCSV"
          />

          <template v-if="shouldShowDownloadLink">
            <UButton
              label="Download nft_class.json"
              :disabled="isLoading"
              variant="outline"
              @click="onDownloadClassJSON"
            />
            <UButton
              label="Download nft_default.json"
              :disabled="isLoading"
              variant="outline"
              @click="onDownloadDefaultClassJSON"
            />
            <UButton
              label="Download nfts.csv"
              :disabled="isLoading"
              variant="outline"
              @click="onDownloadNftsCSV"
            />
          </template>

          <template #footer>
            <UButton
              label="View your NFT"
              variant="outline"
              target="_blank"
              :to="`${likerLandURL}/nft/class/${encodeURIComponent(classId)}`"
            />
            <div class="p-[4px] border-[2px] border-[#f59e0b] rounded-[0.375rem]">
              <UButton
                :to="{ name: 'nft-book-store-new', query: { class_id: classId, count: state.mintCount } }"
                label="Continue to publish NFT Book / 繼續上架"
                variant="solid"
                color="orange"
              />
            </div>
          </template>
        </UCard>

        <UProgress v-if="isLoading" animation="carousel">
          <template #indicator>
            Loading...
          </template>
        </UProgress>
        <EditISCNMetadataModal
          ref="editISCNRef"
          v-model="showEditISCNModal"
          :class-id="classId"
          @save="onSaveISCN"
        />
      </AuthRequiredView>
    </PageBody>
  </PageContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

import { useWalletStore } from '~/stores/wallet'
import { downloadFile, convertArrayOfObjectsToCSV } from '~/utils'
import { NFT_DEFAULT_MINT_AMOUNT, PUBLISHING_NOTICE_URL_EN, PUBLISHING_NOTICE_URL_ZH } from '~/constant'

const { LCD_URL, LIKER_LAND_URL, LIKE_CO_API } = useRuntimeConfig().public
const router = useRouter()
const route = useRoute()
const toast = useToast()

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { initIfNecessary } = store

const likerLandURL = LIKER_LAND_URL
const step = ref(1)
const error = ref('')
const isLoading = ref(false)

const iscnIdInput = ref('')
const iscnOwner = ref('')
const iscnCreateData = ref<any>(null)
const iscnData = ref<any>(null)
const state = reactive({
  prefix: 'BOOKSN',
  mintCount: NFT_DEFAULT_MINT_AMOUNT,
  imageUrl: '',
  externalUrl: '',
  uri: '',
  maxSupply: undefined
})

const formRef = ref()

const classData = ref<any>(null)
const classMaxSupply = ref<number | undefined>(undefined)
const classCreateData = ref<any>(null)

const nftMintListData = ref<any>([])
const nftMintDefaultData = ref<any>(null)
const nftData = ref<any>(null)
const nftCSVData = ref('')
const existingNftCount = ref(0)

const iscnId = computed(() => iscnData.value?.['@id'])
const classId = computed(() => classData.value?.id)
const isCreatingClass = computed(() => !classId.value && step.value === 2)

const shouldShowDownloadLink = ref(false)
const showEditISCNModal = ref(false)
const editISCNRef = ref<any>(null)

const isFormValid = computed(() => {
  return formRef.value?.validate(state).length === 0
})

const isRestockingNFT = ref(false)

watch(iscnId, (newIscnId) => {
  if (newIscnId) {
    router.replace({ query: { ...route.query, iscn_id: newIscnId } })
  }
})

watch(classId, (newClassId) => {
  if (newClassId) {
    router.replace({ query: { ...route.query, class_id: newClassId } })
  }
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

watch(iscnData, (recordData) => {
  if (recordData) {
    state.imageUrl = recordData.contentMetadata?.thumbnailUrl || ''
  }
})

useSeoMeta({
  title: 'Mint Liker Land NFT Book',
  ogTitle: 'Mint Liker Land NFT Book'
})

onMounted(() => {
  // HACK: mitigate disable state stuck issue when iscnIdInput is inited as qs in data
  iscnIdInput.value = route.query.class_id as string || route.query.iscn_id as string || ''
})

function onClickHelpEn () {
  useTrackEvent('mint_nft_click_help_en')
  window.open('https://docs.like.co/depub/nft-book-press', '_blank')
}

function onClickHelpZh () {
  useTrackEvent('mint_nft_click_help_zh')
  window.open('https://docs.like.co/zh/depub/nft-book-press', '_blank')
}

function onClickDisclaimerEn () {
  useTrackEvent('mint_nft_click_disclaimer_en')
  window.open(PUBLISHING_NOTICE_URL_EN, '_blank')
}

function onClickDisclaimerZh () {
  useTrackEvent('mint_nft_click_disclaimer_zh')
  window.open(PUBLISHING_NOTICE_URL_ZH, '_blank')
}

async function onISCNIDInput () {
  try {
    isLoading.value = true
    isRestockingNFT.value = false
    if (iscnIdInput.value.startsWith('iscn://')) {
      const data = await $fetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(iscnIdInput.value)}`)
      const { records, owner } = data as any
      iscnData.value = records[0].data
      iscnOwner.value = owner
      step.value = 2
    } else if (iscnIdInput.value.startsWith('likenft')) {
      const existingListing = await fetch(`${LIKE_CO_API}/likernft/book/store/${iscnIdInput.value}`)
      if (existingListing?.status === 200) {
        isRestockingNFT.value = true
      }
      const data = await $fetch(`${LCD_URL}/cosmos/nft/v1beta1/classes/${encodeURIComponent(iscnIdInput.value)}`)
      if (!data) {
        isRestockingNFT.value = false
        throw new Error('INVALID_NFT_CLASS_ID')
      }
      classData.value = (data as any).class
      const parentIscnId = classData.value?.data?.parent?.iscn_id_prefix
      const resISCN = await $fetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(parentIscnId)}`)
      const { records, owner } = resISCN as any
      iscnData.value = records[0].data
      iscnOwner.value = owner
      step.value = 3
    } else {
      throw new Error('Invalid ISCN ID or NFT Class ID')
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

  if (formRef.value?.validate(state).length !== 0) {
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Required field missing',
      timeout: 3000,
      color: 'red'
    })
    isLoading.value = false
    return
  }

  const nftClassData = {
    name: contentMetadata.name,
    description: contentMetadata.description,
    symbol: 'BOOK',
    uri: state.uri || '',
    metadata: {
      name: contentMetadata.name,
      image: state.imageUrl,
      external_url: state.externalUrl,
      nft_meta_collection_id: 'nft_book',
      nft_meta_collection_name: 'NFT Book',
      nft_meta_collection_description: 'NFT Book by Liker Land'
    }
  }
  const nftsDefaultData = {
    uri: state.uri || '',
    metadata: {
      name: contentMetadata.name,
      image: state.imageUrl,
      external_url: state.externalUrl
    }
  }
  if (!isCreatingClass.value) {
    const { nfts } = await getNFTs({ classId: classId.value as string })
    existingNftCount.value = nfts.length
  }
  if (typeof state.mintCount !== 'number') {
    state.mintCount = Number(state.mintCount)
  }
  const csvDataString = generateNFTMintListCSVData({
    prefix: state.prefix,
    nftMintCount: state.mintCount,
    nftExisitngCount: existingNftCount.value,
    imgUrl: state.imageUrl,
    uri: state.uri
  })
  const csvDataArray = parse(csvDataString, { columns: true })

  classCreateData.value = nftClassData
  nftMintDefaultData.value = nftsDefaultData
  nftMintListData.value = csvDataArray
  state.mintCount = csvDataArray.length

  try {
    if (step.value === 2) {
      await onClassFileInput() // step=3
      if (!classId.value) { throw new Error('CLASS_CREATION_FAILED') }
    }
    await onMintNFTStart() // step=4
    shouldShowDownloadLink.value = true
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
    if (nftMintListData.value.length && nftMintListData.value.length !== state.mintCount) {
      throw new Error(`NFT csv data length ${nftMintListData.value.length} must match nft mint amount ${nftMintCount.value}`)
    }
    const defaultURI = nftMintDefaultData.value.uri
    const defaultMetadata = nftMintDefaultData.value.metadata
    const nfts = [...Array(state.mintCount).keys()].map((i) => {
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
    step.value = 4
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

function onDownloadCSV (e?: Event) {
  if (e) { e.preventDefault() }
  downloadBlob(nftCSVData.value, 'nft_result.csv', 'text/csv;charset=utf-8;')
}

function onDownloadClassJSON (e?: Event) {
  if (e) { e.preventDefault() }
  downloadFile({ data: classCreateData.value, fileName: 'nft_class.json', fileType: 'json' })
}

function onDownloadDefaultClassJSON (e?: Event) {
  if (e) { e.preventDefault() }
  downloadFile({ data: nftMintDefaultData.value, fileName: 'nfts_default.json', fileType: 'json' })
}

function onDownloadNftsCSV (e?: Event) {
  if (e) { e.preventDefault() }
  downloadFile({ data: nftMintListData.value, fileName: 'nfts.csv', fileType: 'csv' })
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

</script>

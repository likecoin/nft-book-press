<template>
  <PageContainer :key="route.path">
    <PageHeader title="Mint Liker Land NFT Book" />

    <PageBody class="flex flex-col items-stretch grow space-y-4">
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
          label: 'Publishing Notice',
          color: 'green',
          variant: 'outline',
          click: onClickDisclaimerEn,
        },{
          label: '出版須知',
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

        <UDivider label="OR" />

        <UCard :ui="{ body: { base: 'space-y-4' } }">
          <UFormGroup>
            <template #label>
              Upload ISCN data json file
              <UButton
                to="https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/iscn.json"
                :padded="false"
                variant="link"
                target="_blank"
              >
                (iscn.json)
              </UButton>
            </template>
            <UInput class="my-4" type="file" accept="application/json" @change="onISCNFileChange" />
          </UFormGroup>
          <UAlert
            title=""
            icon="i-heroicons-light-bulb"
            color="primary"
            variant="soft"
          >
            <template #title>
              You can also create your ISCN using
              <UButton
                :to="`${appLikeCoURL}/new`"
                :padded="false"
                variant="link"
                target="_blank"
              >
                app.like.co
              </UButton>
            </template>
          </UAlert>

          <UTextarea
            v-if="iscnCreateData"
            :value="JSON.stringify(iscnCreateData, null, 2) "
            cols="100"
            :rows="10"
            readonly
          />

          <UButton
            label="Create"
            :disabled="isLoading || !(iscnCreateData)"
            @click="onISCNFileInput"
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

        <UTabs
          class="w-full"
          :items="[
            { label: 'By filling required information', slot: 'input' },
            { label: 'By uploading data files', slot: 'upload' },
          ]"
        >
          <template #upload>
            <UCard :ui="{ body: { base: 'space-y-4' } }">
              <template #header>
                <h3 class="font-bold">
                  Mint NFT by uploading data files
                </h3>
              </template>

              <UFormGroup v-if="isCreatingClass" label="Max number of supply for this NFT Class (optional):">
                <UInput
                  v-model="classMaxSupply"
                  type="number"
                  :min="nftMintCount"
                />
              </UFormGroup>

              <UFormGroup label="Number of NFT to mint:">
                <UInput
                  v-model="nftMintCount"
                  type="number"
                  :min="0"
                  :max="mintMaxCount"
                />
              </UFormGroup>

              <UFormGroup v-if="isCreatingClass">
                <template #label>
                  Upload NFT Class data JSON file (<UButton
                    label="nft_class.json"
                    to="https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/nft_class.json"
                    variant="link"
                    :padded="false"
                    target="_blank"
                  />)
                </template>
                <UInput type="file" accept="application/json" @change="onClassFileChange" />
                <UTextarea
                  v-if="classCreateData"
                  :value="JSON.stringify(classCreateData, null, 2)"
                  class="mt-2"
                  cols="100"
                  :rows="10"
                  readonly
                />
              </UFormGroup>

              <UFormGroup>
                <template #label>
                  Upload NFT default data JSON file<br>(<UButton
                    label="nfts_default.json"
                    to="https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/nfts_default.json"
                    variant="link"
                    :padded="false"
                    target="_blank"
                  />)
                </template>
                <UInput type="file" accept="application/json" @change="onMintNFTDefaultFileChange" />
                <UTextarea
                  v-if="nftMintDefaultData"
                  :value="JSON.stringify(nftMintDefaultData, null, 2)"
                  cols="100"
                  :rows="10"
                  readonly
                />
              </UFormGroup>

              <UFormGroup>
                <template #label>
                  Upload NFT CSV file (<UButton
                    label="nfts.csv"
                    to="https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/nfts.csv"
                    variant="link"
                    :padded="false"
                    target="_blank"
                  />)
                </template>
                <UInput type="file" accept=".csv" @change="onMintNFTFileChange" />
              </UFormGroup>

              <UAlert
                v-if="nftMintListData?.length"
                :title="`Number of NFT data in CSV: ${nftMintListData?.length}`"
              />

              <template #footer>
                <UButton
                  label="Mint"
                  :disabled="
                    isLoading ||
                      !(
                        (!isCreatingClass || classCreateData) &&
                        nftMintDefaultData &&
                        nftMintListData
                      )"
                  @click="onClickMintByUploading"
                />
              </template>
            </UCard>
          </template>

          <template #input>
            <UCard
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
              </UForm>
              <template #footer>
                <UButton
                  label="Mint"
                  :disabled="isLoading || !(state.nftIdPrefix && nftMintCount && imageUrl) || hasError"
                  @click="onClickMintByInputting"
                />
              </template>
            </UCard>
          </template>
        </UTabs>
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
              :to="{ name: 'nft-book-store-new', query: { class_id: classId, count: nftMintCount } }"
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
    </PageBody>
  </PageContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import type { FormError } from '#ui/types'

import { useWalletStore } from '~/stores/wallet'
import { downloadFile, convertArrayOfObjectsToCSV, sleep } from '~/utils'
import { NFT_DEFAULT_MINT_AMOUNT, PUBLISHING_NOTICE_URL_EN, PUBLISHING_NOTICE_URL_ZH } from '~/constant'

const { LCD_URL, APP_LIKE_CO_URL, LIKER_LAND_URL } = useRuntimeConfig().public
const router = useRouter()
const route = useRoute()

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
const iscnCreateData = ref<any>(null)
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
// HACK: set max supply to 50 to avoid authcore max int issue
const mintMaxCount = computed(() => Math.min(classMaxSupply.value || NFT_DEFAULT_MINT_AMOUNT))

const shouldShowDownloadLink = ref(false)

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
    imageUrl.value = recordData.contentMetadata?.thumbnailUrl || ''
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
    if (iscnIdInput.value.startsWith('iscn://')) {
      const { data, error } = await useFetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(iscnIdInput.value)}`)
      if (error.value) { throw new Error(error.value) }
      const { records, owner } = data.value as any
      iscnData.value = records[0].data
      iscnOwner.value = owner
      step.value = 2
    } else if (iscnIdInput.value.startsWith('likenft')) {
      const { data } = await useFetch(`${LCD_URL}/cosmos/nft/v1beta1/classes/${encodeURIComponent(iscnIdInput.value)}`)
      if (!data?.value) { throw new Error('INVALID_NFT_CLASS_ID') }
      classData.value = (data.value as any).class
      const parentIscnId = classData.value?.data?.parent?.iscn_id_prefix
      const { data: resISCN } = await useFetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(parentIscnId)}`)
      const { records, owner } = resISCN.value as any
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

async function onISCNFileInput () {
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await initIfNecessary()
    }
    if (!wallet.value || !signer.value) { throw new Error('NO_WALLET') }
    if (!iscnCreateData.value) { throw new Error('NO_ISCN_DATA') }
    const newIscnId = await signCreateISCNRecord(iscnCreateData.value, signer.value, wallet.value)
    // HACK: wait 1 block before querying
    await sleep(6000)
    const { data } = await useFetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(newIscnId)}`)
    if (!data?.value) { throw new Error('INVALID_ISCN_ID') }
    const { records, owner } = data.value as any
    iscnData.value = records[0].data
    iscnOwner.value = owner
    step.value = 2
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

function onISCNFileChange (files: FileList) {
  if (!files) { return }
  const [file] = files
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result
      if (typeof text !== 'string') { return }
      const json = JSON.parse(text)
      if (!json || !json.contentMetadata) { throw new Error('Invalid ISCN data json') }
      iscnCreateData.value = json
    } catch (err) {
      console.error(err)
      error.value = (err as Error).toString()
    }
  }
  reader.readAsText(file)
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
      nft_meta_collection_descrption: 'NFT Book by Liker Land'
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
    await onMintNFTStart() // step=4
    shouldShowDownloadLink.value = true
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

async function onClickMintByUploading () {
  isLoading.value = true
  try {
    if (step.value === 2) {
      await onClassFileInput() // step=3
    }
    await onMintNFTStart() // step=4
    shouldShowDownloadLink.value = false
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
    const { data } = await useFetch(`${LCD_URL}/cosmos/nft/v1beta1/classes/${encodeURIComponent(newClassId)}`)
    if (!data?.value) { throw new Error('INVALID_NFT_CLASS_ID') }
    classData.value = (data.value as any).class
    step.value = 3
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

function onClassFileChange (files: FileList) {
  if (!files) { return }
  const [file] = files
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result
      if (typeof text !== 'string') { return }
      const json = JSON.parse(text)
      if (!json || !json.name) { throw new Error('Invalid Class data json') }
      classCreateData.value = json
    } catch (err) {
      console.error(err)
      error.value = (err as Error).toString()
    }
  }
  reader.readAsText(file)
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
    step.value = 4
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

function onMintNFTDefaultFileChange (files: FileList) {
  if (!files) { return }
  const [file] = files
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result
      if (typeof text !== 'string') { return }
      const json = JSON.parse(text)
      if (!json || json.uri === undefined) { throw new Error('Invalid NFT default data json') }
      nftMintDefaultData.value = json
    } catch (err) {
      console.error(err)
      error.value = (err as Error).toString()
    }
  }
  reader.readAsText(file)
}

function onMintNFTFileChange (files: FileList) {
  if (!files) { return }
  const [file] = files
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result
      if (typeof text !== 'string') { return }
      const data = parse(text, { columns: true })
      nftMintListData.value = data
      nftMintCount.value = data.length
    } catch (err) {
      console.error(err)
      error.value = (err as Error).toString()
    }
  }
  reader.readAsText(file)
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

</script>

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

        <UFormGroup v-if="iscnId" label="ISCN ID">
          <UButton
            class="font-mono"
            :label="iscnId"
            :to="`${appLikeCoURL}/view/${encodeURIComponent(iscnId)}`"
            target="_blank"
            variant="link"
            :padded="false"
          />
        </UFormGroup>

        <UFormGroup label="Owner">
          <UButton
            :label="iscnOwner"
            :to="`${likerLandURL}/${encodeURIComponent(iscnOwner)}`"
            target="_blank"
            variant="link"
            :padded="false"
          />
        </UFormGroup>

        <UFormGroup label="Title">
          <UInput
            v-model="className"
            :value="iscnData?.contentMetadata?.name"
            :readonly="isCreatingClass"
            variant="none"
            :padded="false"
          />
        </UFormGroup>
        <UFormGroup label="Description">
          <UInput
            v-model="classDescription"
            :value="iscnData?.contentMetadata?.description"
            :readonly="isCreatingClass"
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
              <template #footer>
                <UButton
                  label="Mint"
                  :disabled="isLoading || !(nftMintCount && imageUrl) || hasError"
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
      <EditISCNMetadataModal
        ref="editISCNRef"
        v-model="showEditISCNModal"
        :class-id="classId"
        @save="onSaveISCN"
      />
    </PageBody>
  </PageContainer>
</template>

<script setup lang="ts">
import { useWriteContract } from '@wagmi/vue'
import { storeToRefs } from 'pinia'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { waitForTransactionReceipt } from '@wagmi/vue/actions'
import { hexToNumber } from 'viem'

import { useWalletStore } from '~/stores/wallet'
import { downloadFile, convertArrayOfObjectsToCSV } from '~/utils'
import { NFT_DEFAULT_MINT_AMOUNT, PUBLISHING_NOTICE_URL_EN, PUBLISHING_NOTICE_URL_ZH } from '~/constant'
import { LIKE_NFT_ABI, LIKE_NFT_CLASS_ABI, LIKE_NFT_CONTRACT_ADDRESS } from '~/contracts/likeNFT'
import { config } from '~/utils/wagmi/config'

const {
  getClassOwner,
  getClassMetadata,
  checkNFTClassIsBookNFT,
  getClassCurrentTokenId
} = useNFTContractReader()
const {
  LCD_URL,
  APP_LIKE_CO_URL,
  LIKER_LAND_URL,
  LIKE_EVM_NFT_TARGET_ADDRESS
} = useRuntimeConfig().public
const router = useRouter()
const route = useRoute()
const { writeContractAsync } = useWriteContract()

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
const hasError = ref(false)
const imageUrl = ref('')
const externalUrl = ref('')

const classMaxSupply = ref<number>(1000)
const classCreateData = ref<any>(null)

const nftMintListData = ref<any>([])
const nftMintDefaultData = ref<any>(null)
const nftMintCount = ref(NFT_DEFAULT_MINT_AMOUNT)
const nftCSVData = ref('')

const iscnId = computed(() => iscnData.value?.['@id'])
const classId = ref('')
const isCreatingClass = computed(() => !classId.value && step.value === 2)
const className = ref('')
const classDescription = ref('')
// HACK: set max supply to 50 to avoid authcore max int issue
const mintMaxCount = computed(() => Math.min(classMaxSupply.value || NFT_DEFAULT_MINT_AMOUNT))

const shouldShowDownloadLink = ref(false)
const showEditISCNModal = ref(false)
const editISCNRef = ref<any>(null)

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
  classId.value = route.query.class_id as string || ''
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
    if (iscnIdInput.value.startsWith('iscn://')) {
      const data = await $fetch(`${LCD_URL}/iscn/records/id?iscn_id=${encodeURIComponent(iscnIdInput.value)}`)
      const { records, owner } = data as any
      iscnData.value = records[0].data
      iscnOwner.value = owner
      step.value = 2
    } else if (iscnIdInput.value.startsWith('0x')) {
      const isBookNFT = await checkNFTClassIsBookNFT(iscnIdInput.value)
      if (!isBookNFT) {
        throw new Error('Invalid NFT Class ID')
      }
      const [data, owner] = await Promise.all([
        getClassMetadata(iscnIdInput.value),
        getClassOwner(iscnIdInput.value)
      ])
      if (!data) { throw new Error('Invalid NFT Class ID') }
      iscnData.value = { contentMetadata: data }
      iscnOwner.value = owner as string
      classId.value = iscnIdInput.value
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
    iscnData.value = iscnCreateData.value
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
  nftMintCount,
  imgUrl
}: {
  nftMintCount: number;
  imgUrl: string;
}) {
  const csvRows = []
  for (let i = 0; i < nftMintCount; i++) {
    csvRows.push({
      image: imgUrl,
      metadata: ''
    })
  }
  return convertArrayOfObjectsToCSV(csvRows)
}

async function onClickMintByInputting () {
  isLoading.value = true
  const { contentMetadata } = iscnData.value

  const {
    name,
    description
  } = contentMetadata
  const nftClassData = {
    name,
    symbol: 'BOOK',
    metadata: {
      name,
      description,
      symbol: 'BOOK',
      ...contentMetadata,
      image: imageUrl.value,
      external_url: externalUrl.value,
      nft_meta_collection_id: 'nft_book',
      nft_meta_collection_name: 'NFT Book',
      nft_meta_collection_description: 'NFT Book by Liker Land',
      recordTimestamp: new Date().toISOString()
    }
  }
  const nftsDefaultData = {
    name,
    description,
    symbol: 'BOOK',
    ...contentMetadata,
    image: imageUrl.value,
    external_url: externalUrl.value
  }
  if (typeof nftMintCount.value !== 'number') {
    nftMintCount.value = Number(nftMintCount.value)
  }
  const csvDataString = generateNFTMintListCSVData({
    nftMintCount: nftMintCount.value,
    imgUrl: imageUrl.value
  })
  const csvDataArray = parse(csvDataString, { columns: true })

  classCreateData.value = nftClassData
  nftMintDefaultData.value = nftsDefaultData
  nftMintListData.value = csvDataArray
  nftMintCount.value = csvDataArray.length

  try {
    if (step.value === 2) {
      await onClassFileInput() // step=3
      if (!classId.value) { throw new Error('CLASS_CREATION_FAILED') }
    }
    if (!classId.value) { throw new Error('NO_CLASS_ID') }
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
      if (!classId.value) { throw new Error('CLASS_CREATION_FAILED') }
    }
    if (!classId.value) { throw new Error('NO_CLASS_ID') }
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
    const {
      name,
      symbol,
      metadata
    } = classCreateData.value
    const res = await writeContractAsync({
      address: LIKE_NFT_CONTRACT_ADDRESS,
      abi: LIKE_NFT_ABI,
      functionName: 'newBookNFT',
      args: [{
        creator: wallet.value,
        updaters: [wallet.value, LIKE_EVM_NFT_TARGET_ADDRESS],
        minters: [wallet.value, LIKE_EVM_NFT_TARGET_ADDRESS],
        config: {
          name,
          symbol,
          metadata: JSON.stringify(metadata),
          max_supply: classMaxSupply.value || 1000
        }
      }]
    })
    const receipt = await waitForTransactionReceipt(config, { hash: res })
    // eslint-disable-next-line no-console
    console.log(receipt)
    if (!receipt || receipt.status !== 'success') { throw new Error('INVALID_RECEIPT') }
    if (!receipt.logs[0].address) { throw new Error('INVALID_CLASS_ID') }
    classId.value = receipt.logs[0].address
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
    const defaultMetadata = nftMintDefaultData.value
    const tokenId = await getClassCurrentTokenId(classId.value)
    const nfts = [...Array(nftMintCount.value).keys()].map((i) => {
      const {
        image: dataImage,
        metadata: dataMetadataString,
        ...otherData
      } = nftMintListData?.value?.[i] || {}
      const dataMetadata = JSON.parse(dataMetadataString || '{}')
      const { name } = defaultMetadata
      const data = { attributes: [], ...defaultMetadata, ...dataMetadata }
      if (name) { data.name = `${name} #${tokenId + i + 1}` }
      if (dataImage) { data.image = dataImage }
      if (data.author) {
        data.attributes.push({
          trait_type: 'Author',
          value: data.author
        })
      }
      if (data.publisher) {
        data.attributes.push({
          trait_type: 'Publisher',
          value: data.publisher
        })
      }
      if (data.datePublished) {
        data.attributes.push({
          trait_type: 'Publish Date',
          display_type: 'date',
          value: (new Date(data.datePublished)).getTime() || 0
        })
      }
      Object.entries(otherData).forEach(([key, value]) => {
        if (value) {
          try {
            data[key] = JSON.parse(value as string)
          } catch (err) {
            data[key] = value
          }
        }
      })
      return {
        id: -1,
        metadata: data
      }
    })
    const res = await writeContractAsync({
      address: classId.value as `0x${string}`,
      abi: LIKE_NFT_CLASS_ABI,
      functionName: 'safeMintWithTokenId',
      args: [
        tokenId,
        Array(nftMintCount.value).fill(wallet.value),
        Array(nftMintCount.value).fill(''),
        nfts.map(nft => JSON.stringify(nft.metadata))
      ]
    })
    const receipt = await waitForTransactionReceipt(config, { hash: res })
    // eslint-disable-next-line no-console
    console.log(receipt)
    if (!receipt || receipt.status !== 'success') { throw new Error('INVALID_RECEIPT') }
    if (receipt.logs[0].topics[3] === undefined) { throw new Error('INVALID_NFT_ID') }
    receipt.logs.forEach((log) => {
      if (log.topics[3] !== undefined) {
        const nftId = hexToNumber(log.topics[3])
        nfts[nftId].id = nftId
      }
    })
    nftCSVData.value = stringify(nfts, { header: true })
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
      if (!json) { throw new Error('Invalid NFT default data json') }
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

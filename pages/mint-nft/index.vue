<template>
  <div>
    <h1>Mint LikeCoin NFT/NFT Book</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div>Steps {{ step }} / 4</div>
    <hr>
    <section v-if="step === 1">
      <h2>1. Select or Create ISCN</h2>
      <div v-if="!iscnCreateData">
        <p><label>Enter ISCN ID or NFT Class ID:</label></p>
        <input v-model="iscnIdInput" placeholder="iscn://... or likenft....">
        <button class="button" :disabled="isLoading || !(iscnIdInput)" @click="onISCNIDInput">
          Submit
        </button>
      </div>
      <br>
      <br>
      or
      <br>
      <div>
        <p>
          <label>Upload ISCN data json (
            <a
              href="https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/iscn.json"
              target="_blank"
            >
              iscn.json
            </a>
            ) file:</label>
        </p>
        <div v-if="iscnCreateData">
          <!-- eslint-disable-next-line vue/no-textarea-mustache -->
          <textarea cols="100" rows="10" readonly>{{ JSON.stringify(iscnCreateData, null, 2) }}</textarea>
        </div>
        <input type="file" @change="onISCNFileChange">
        <br>
        <p>
          You can also create your ISCN using
          <a :href="`${appLikeCoURL}/new`" target="_blank">app.like.co</a>
        </p>

        <button
          class="button"
          :disabled="isLoading || !(iscnCreateData)"
          @click="onISCNFileInput"
        >
          Create
        </button>
      </div>
    </section>
    <section v-else-if="step > 1">
      <h3>ISCN Information</h3>
      <p>
        ISCN ID:
        <a
          target="_blank"
          :href="`${appLikeCoURL}/iscn/${encodeURIComponent(iscnId)}`"
        >
          {{ iscnId }}
        </a>
      </p>
      <p>
        ISCN Owner:
        <a
          target="_blank"
          :href="`${likerLandURL}/${encodeURIComponent(iscnOwner)}`"
        >{{ iscnOwner }}</a>
      </p>
      <p>ISCN Title: {{ iscnData?.contentMetadata?.name }}</p>
      <hr>
    </section>
    <section v-if="step === 2">
      <h2>2. Create NFT Class</h2>
      <div style="display: flex; flex-direction: row; justify-content: center; align-items: start; gap: 24px">
        <!-- Mint NFT by uploading data files -->
        <div class="container">
          <h3>Mint NFT by uploading data files</h3>

          <label>Max number of supply for this NFT Class (optional):</label>
          <input v-model="classMaxSupply" type="number">
          <label>Number of NFT to mint:</label>
          <input v-model="nftMintCount" type="number">

          <p>
            <label>Upload NFT Class data json (
              <a
                href="https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/nft_class.json"
                target="_blank"
              >
                nft_class.json
              </a>
              ) file: </label>
          </p>
          <div v-if="classCreateData">
            <!-- eslint-disable-next-line vue/no-textarea-mustache -->
            <textarea cols="100" rows="10" readonly>{{ JSON.stringify(classCreateData, null, 2) }}</textarea>
          </div>
          <input type="file" @change="onClassFileChange">
          <p>
            <label>Upload NFT default data json (
              <a
                href="https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/nfts_default.json"
                target="_blank"
              >
                nfts_default.json
              </a>) file: </label>
          </p>
          <div v-if="nftMintDefaultData">
            <!-- eslint-disable-next-line vue/no-textarea-mustache -->
            <textarea cols="100" rows="10" readonly>{{ JSON.stringify(nftMintDefaultData, null, 2) }}</textarea>
          </div>
          <input type="file" @change="onMintNFTDefaultFileChange">
          <p>
            <label>Upload NFT CSV (<a
              href="https://github.com/likecoin/iscn-nft-tools/blob/master/mint-nft/samples/nfts.csv"
              target="_blank"
            >
              nfts.csv
            </a>) file: </label>
          </p>
          <div v-if="nftMintListData?.length">
            <pre>Number of NFT data in CSV:{{ nftMintListData?.length }}</pre>
          </div>
          <input type="file" @change="onMintNFTFileChange">
          <br>

          <button
            class="button"
            :disabled="
              isLoading ||
                !(
                  classCreateData &&
                  nftMintDefaultData &&
                  nftMintListData
                )"
            @click="onClickMintByUploading"
          >
            Mint
          </button>
        </div>

        <div style="align-self: center;">
          <h3>or</h3>
        </div>

        <!-- input data to mint -->
        <div class="container">
          <h3>Mint NFT by filling required information</h3>
          <div style="display: flex; flex-direction: column; gap: 8px">
            <div>
              <label>NFT ID Prefix: </label>
              <input v-model="nftIdPrefix" placeholder="English only ex.MoneyVerse">
            </div>
            <div>
              <label>Number of NFT to mint: </label>
              <input v-model="nftMintCount" placeholder="0-100">
            </div>
            <div>
              <label>Image URL: </label>
              <input v-model="imageUrl" placeholder="ipfs:// ... or ar://....">
            </div>
            <div>
              <label>External URL (optional):</label>
              <input v-model="externalUrl" placeholder="https://">
            </div>
            <div>
              <label>URI (optional):</label>
              <input v-model="uri" placeholder="https://">
            </div>
            <div>
              <label>Max number of supply for this NFT Class (optional):</label>
              <input
                v-model="classMaxSupply"
                :placeholder="`> ${nftMintCount}`"
              >
              <span
                v-if="classMaxSupply && classMaxSupply < nftMintCount"
                style="color: red"
              >should more than number of NFT to mint</span>
            </div>
          </div>
          <button
            class="button"
            :disabled="isLoading || !(nftIdPrefix && nftMintCount && imageUrl)"
            @click="onClickMintByInputting"
          >
            Mint
          </button>
        </div>
      </div>
    </section>
    <section v-else-if="step > 2 && classId">
      <h3>NFT Class Information</h3>
      <p>
        NFT Class ID:
        <a
          target="_blank"
          :href="`${likerLandURL}/nft/class/${encodeURIComponent(classId)}`"
        >
          {{ classId }}
        </a>
      </p>
      <hr>
    </section>

    <section v-if="step > 3">
      Success!

      <ul>
        <li>
          <a href="#" :disabled="isLoading" @click="onDownloadCSV">
            Download NFT result csv
          </a>
        </li>

        <li v-if="shouldShowDownloadLink">
          <a href="#" :disabled="isLoading" @click="onDownloadClassJSON">
            Download nft_class.json
          </a>
        </li>
        <li v-if="shouldShowDownloadLink">
          <a href="#" :disabled="isLoading" @click="onDownloadDefaultClassJSON">
            Download nft_default.json
          </a>
        </li>
        <li v-if="shouldShowDownloadLink">
          <a href="#" :disabled="isLoading" @click="onDownloadNftsCSV">
            Download nfts.csv
          </a>
        </li>

        <li>
          <a
            target="_blank"
            :href="`${likerLandURL}/nft/class/${encodeURIComponent(classId)}`"
          >
            View your NFT
          </a>
        </li>
      </ul>

      <NuxtLink :to="{ name: 'nft-book-store-new', query: { class_id: classId, count: nftMintCount } }">
        Continue to publish NFT Book
      </NuxtLink>
    </section>
    <div v-if="isLoading" style="color: green; width: 100%; text-align: center;">
      <h3>Loading...</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

import { useWalletStore } from '~/stores/wallet'
import { LCD_URL, APP_LIKE_CO_URL, LIKER_LAND_URL } from '~/constant'
import { downloadFile, generateCsvData, sleep } from '~/utils'

const router = useRouter()
const route = useRoute()

const store = useWalletStore()
const { wallet, signer } = storeToRefs(store)
const { connect } = store

const appLikeCoURL = APP_LIKE_CO_URL
const likerLandURL = LIKER_LAND_URL
const step = ref(1)
const error = ref('')
const isLoading = ref(false)

const iscnIdInput = ref(route.query.class_id || route.query.iscn_id || '')
const iscnOwner = ref('')
const iscnCreateData = ref<any>(null)
const iscnData = ref<any>(null)
const nftIdPrefix = ref('')
const imageUrl = ref('')
const externalUrl = ref('')
const uri = ref('')

const classData = ref<any>(null)
const classMaxSupply = ref<number | undefined>(undefined)
const classCreateData = ref<any>(null)

const nftMintListData = ref<any>([])
const nftMintDefaultData = ref<any>(null)
const nftMintCount = ref(100)
const nftData = ref<any>(null)
const nftCSVData = ref('')

const iscnId = computed(() => iscnData.value?.['@id'])
const classId = computed(() => classData.value?.id)

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
      step.value = 4
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
      await connect()
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

function onISCNFileChange (event: Event) {
  if (!event?.target) { return }
  const files = (event.target as HTMLInputElement)?.files
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

async function onClickMintByInputting () {
  isLoading.value = true
  step.value = 3
  const { contentMetadata } = iscnData.value

  const nftClassData = {
    name: contentMetadata.name,
    description: contentMetadata.description,
    symbol: 'CNR',
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
  const csvDataString = generateCsvData({
    prefix: nftIdPrefix.value,
    nftMintCount: nftMintCount.value,
    imgUrl: imageUrl.value,
    uri: uri.value
  })
  const csvDataArray = parse(csvDataString, { columns: true })

  classCreateData.value = nftClassData
  nftMintDefaultData.value = nftsDefaultData
  nftMintListData.value = csvDataArray
  nftMintCount.value = csvDataArray.length

  try {
    await onClassFileInput() // step=3
    await onMintNFTStart() // step=4
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    step.value = 4
    shouldShowDownloadLink.value = true
  }
}

async function onClickMintByUploading () {
  isLoading.value = true
  step.value = 3
  try {
    await onClassFileInput() // step=3
    await onMintNFTStart() // step=4
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    step.value = 4
    shouldShowDownloadLink.value = false
  }
}

async function onClassFileInput () {
  try {
    isLoading.value = true
    if (!wallet.value || !signer.value) {
      await connect()
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

function onClassFileChange (event: Event) {
  if (!event?.target) { return }
  const files = (event.target as HTMLInputElement)?.files
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
      await connect()
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

function onMintNFTDefaultFileChange (event: Event) {
  if (!event?.target) { return }
  const files = (event.target as HTMLInputElement)?.files
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

function onMintNFTFileChange (event: Event) {
  if (!event?.target) { return }
  const files = (event.target as HTMLInputElement)?.files
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
  downloadBlob(nftCSVData.value, 'nft.csv', 'text/csv;charset=utf-8;')
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
  downloadFile({ data: nftMintListData.value, fileName: 'nft.csv', fileType: 'csv' })
}

</script>
<style scoped>
 input {
  display: block;
  width: 250px;
  margin-bottom: 8px;
}
.button{
  margin-top: 16px;
  font-size: 16px;
  min-width: 68px;
  background-color: wheat;
  cursor: pointer;
}
.container{
  border: 1px solid gray;
  padding: 6px;
  border-radius: 4px;
}
</style>

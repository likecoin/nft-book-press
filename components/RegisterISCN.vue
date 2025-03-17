<template>
  <div class="flex flex-col gap-6">
    <!-- Basic Info -->
    <UFormGroup label="Type" class="flex-1">
      <USelect
        v-model="iscnData.type"
        :options="typeOptions"
        placeholder="Select type"
      />
    </UFormGroup>

    <UFormGroup label="Title" class="flex-1" required>
      <UInput v-model="iscnData.title" placeholder="Enter ISCN title" />
    </UFormGroup>

    <UFormGroup label="Description" class="flex-1" required>
      <UTextarea
        v-model="iscnData.description"
        placeholder="Enter ISCN description"
        autoresize
      />
    </UFormGroup>

    <div class="grid grid-cols-3 gap-4">
      <UFormGroup label="ISBN">
        <UInput v-model="iscnData.isbn" placeholder="Enter ISBN" />
      </UFormGroup>

      <UFormGroup label="Publisher">
        <UInput
          v-model="iscnData.publisher"
          placeholder="Enter publisher name"
        />
      </UFormGroup>

      <UFormGroup label="Publication Date">
        <UInput
          v-model="iscnData.publicationDate"
          type="date"
          placeholder="Select date"
        />
      </UFormGroup>

      <UFormGroup label="Language">
        <USelect
          v-model="iscnData.language"
          :options="languageOptions"
          placeholder="Select language"
        />
      </UFormGroup>

      <UFormGroup label="Cover Image">
        <UInput
          v-model="iscnData.coverUrl"
          placeholder="ar://{arweave_id}"
          class="font-mono"
        />
      </UFormGroup>

      <UFormGroup label="書訊">
        <UInput
          v-model="iscnData.bookInfoUrl"
          placeholder="Enter book info URL"
        />
      </UFormGroup>
    </div>

    <!-- Author Info -->
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Author Name" required>
        <UInput
          v-model="iscnData.author.name"
          placeholder="Enter author name"
        />
      </UFormGroup>

      <UFormGroup label="Author Description">
        <UTextarea
          v-model="iscnData.author.description"
          placeholder="Enter author description"
          autoresize
        />
      </UFormGroup>
    </div>

    <UFormGroup label="License" class="flex-1">
      <div class="space-y-2">
        <USelect
          v-model="iscnData.license"
          :options="licenseOptions"
          placeholder="Select license"
        />
        <UInput
          v-if="iscnData.license === 'Other'"
          v-model="customLicense"
          placeholder="Enter custom license"
        />
      </div>
    </UFormGroup>

    <!-- Content Fingerprints -->
    <div class="border p-4 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium">
          Content Fingerprint
        </h3>
      </div>
      <div
        v-for="(fingerprint, index) in iscnData.contentFingerprints"
        :key="index"
        class="flex gap-4 items-end"
      >
        <div class="flex justify-between items-end w-full gap-[8px]">
          <UFormGroup class="w-full" :label="`URL #${index + 1}`">
            <UInput
              v-model="fingerprint.url"
              class="w-full"
              placeholder="Enter fingerprint URL"
            />
          </UFormGroup>
          <UButton
            v-if="iscnData.contentFingerprints.length > 1"
            color="red"
            class="w-min"
            variant="soft"
            icon="i-heroicons-trash"
            @click="removeContentFingerprint(index)"
          />
        </div>
        <UButton
          v-if="index === iscnData.contentFingerprints.length - 1"
          variant="soft"
          icon="i-heroicons-plus"
          class="mb-[2px]"
          @click="addContentFingerprint"
        />
      </div>
    </div>

    <!-- Downloadable URLs -->
    <div class="border p-4 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium">
          Downloadable URL
        </h3>
      </div>
      <div
        v-for="(download, index) in iscnData.downloadableUrls"
        :key="index"
        class="flex gap-4 items-end"
      >
        <div class="grid grid-cols-3 gap-4 flex-1">
          <UFormGroup label="Type">
            <UInput v-model="download.type" placeholder="Enter file type" />
          </UFormGroup>
          <UFormGroup label="URL">
            <UInput v-model="download.url" placeholder="Enter download URL" />
          </UFormGroup>
          <UFormGroup label="Filename">
            <UInput v-model="download.fileName" placeholder="Enter filename" />
          </UFormGroup>
        </div>
        <UButton
          v-if="index === iscnData.downloadableUrls.length - 1"
          variant="soft"
          icon="i-heroicons-plus"
          class="mb-[2px]"
          @click="addDownloadableUrl"
        />
        <UButton
          v-if="iscnData.downloadableUrls.length > 1"
          color="red"
          variant="soft"
          icon="i-heroicons-trash"
          @click="removeDownloadableUrl(index)"
        />
      </div>
    </div>
    <UModal
      :model-value="!!uploadStatus"
      :prevent-close="true"
      :ui="{
        base: 'p-4 gap-2'
      }"
    >
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <UBadge color="Badge" variant="soft">
            {{ uploadStatus }}
          </UBadge>
          <p class="text-xs text-gray-500">
            請勿關閉此視窗，直到 ISCN 註冊完成。
          </p>
        </div>
        <UProgress
          animation="carousel"
          color="primary"
          class="w-full"
        />
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { BigNumber } from 'bignumber.js'
import { storeToRefs } from 'pinia'
import { useFileUpload } from '~/composables/useFileUpload'
import { estimateISCNTxGasAndFee, formatISCNTxPayload, signISCNTx } from '~/utils/iscn'
import { useWalletStore } from '~/stores/wallet'
import { getAccountBalance } from '~/utils/cosmos'
import { ISCN_GAS_MULTIPLIER } from '~/constant/index'
import { useUploadStore } from '~/stores/upload'

const walletStore = useWalletStore()
const uploadStore = useUploadStore()

const { wallet, signer } = storeToRefs(walletStore)
const { initIfNecessary } = walletStore
const { getUploadFileData, updateUploadFileData } = uploadStore
const { stripHtmlTags, formatLanguage } = useFileUpload()
const toast = useToast()
const languageOptions = ref([
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' }
])

const typeOptions = [
  { label: 'Book', value: 'Book' },
  { label: 'Photo', value: 'Photo' },
  { label: 'Image', value: 'Image' },
  { label: 'CreativeWork', value: 'CreativeWork' }
]

const licenseOptions = [
  { label: 'Copyright. All rights reserved.', value: 'All Rights Reserved' },
  { label: 'CC BY-NC-ND', value: 'https://creativecommons.org/licenses/by-nc-nd/4.0/' },
  { label: 'CC BY-NC-SA', value: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' },
  { label: 'CC BY-NC', value: 'https://creativecommons.org/licenses/by-nc/4.0/' },
  { label: 'CC BY-ND', value: 'https://creativecommons.org/licenses/by-nd/4.0/' },
  { label: 'CC BY-SA', value: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { label: 'CC BY', value: 'https://creativecommons.org/licenses/by/4.0/' },
  { label: 'CC0 (Public Domain)', value: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  { label: 'Other', value: 'Other' }
]

const customLicense = ref('')

const iscnData = ref({
  type: 'Book',
  title: '',
  description: '',
  isbn: '',
  publisher: '',
  publicationDate: '',
  author: {
    name: '',
    description: '',
    url: ''
  },
  license: 'All Rights Reserved',
  contentFingerprints: [{ url: '' }],
  downloadableUrls: [{
    url: '',
    type: '',
    fileName: ''
  }],
  language: '',
  bookInfoUrl: '',
  tags: [],
  coverUrl: ''
})

const balance = ref(new BigNumber(0))
const iscnFee = ref(new BigNumber(0))
const iscnGasFee = ref('0')
const uploadStatus = ref('')
const error = ref('')
const emit = defineEmits(['handleSubmit', 'submit'])

const totalFee = computed(() => {
  return iscnFee.value || new BigNumber(0)
})

const formattedSameAsList = computed(() => {
  return iscnData.value.downloadableUrls
    .filter(download => download.fileName && download.url)
    .map((download) => {
      if (download.fileName && download.type) {
        return `${download.url}?name=${download.fileName.replace(/\s+/g, '')}`
      }
      return ''
    })
    .filter(Boolean)
})
const payload = computed(() => ({
  type: iscnData.value.type,
  name: iscnData.value.title,
  description: iscnData.value.description,
  author: iscnData.value.author.name,
  authorDescription: iscnData.value.author.description,
  license: iscnData.value.license === 'Other' ? customLicense.value : iscnData.value.license,
  contentFingerprints: iscnData.value.contentFingerprints.map(f => f.url),
  inLanguage: iscnData.value.language,
  publisher: iscnData.value.publisher,
  isbn: iscnData.value.isbn,
  datePublished: iscnData.value.publicationDate
    ? new Date(iscnData.value.publicationDate).toISOString().split('T')[0]
    : undefined,
  url: iscnData.value.bookInfoUrl,
  tagsString: iscnData.value.tags?.join(', ') || '',
  sameAs: formattedSameAsList.value,
  thumbnailUrl: iscnData.value.coverUrl
}))

const isFormValid = computed(() => {
  const requiredFields = {
    title: !!iscnData.value.title,
    description: !!iscnData.value.description,
    authorName: !!iscnData.value.author.name,
    contentUrl: !!iscnData.value.contentFingerprints.some(f => !!f.url)
  }

  error.value = Object.entries(requiredFields)
    .find(([_, isValid]) => !isValid)?.[0]
    ?.toUpperCase() || ''

  return Object.values(requiredFields).every(Boolean)
})

onMounted(() => {
  const initialData = initializeFromSessionStorage()
  if (initialData) {
    iscnData.value = initialData
  }
  calculateISCNFee()
})

const initializeFromSessionStorage = () => {
  const data = getUploadFileData()
  if (!data) { return null }

  const baseData = {
    type: 'Book',
    title: data.epubMetadata?.title || '',
    description: stripHtmlTags(data.epubMetadata?.description || ''),
    isbn: '',
    publisher: '',
    publicationDate: '',
    author: {
      name: data.epubMetadata?.author || '',
      description: ''
    },
    license: 'All Rights Reserved',
    contentFingerprints: [],
    downloadableUrls: [],
    coverUrl: data.epubMetadata?.thumbnailArweaveId
      ? `ar://${data.epubMetadata.thumbnailArweaveId}`
      : '',
    language: formatLanguage(data.epubMetadata?.language || ''),
    tags: data.epubMetadata?.tags || []
  }

  baseData.downloadableUrls = data.fileRecords
    .filter(r => r.fileType === 'epub' || r.fileType === 'pdf')
    .map(file => ({
      url: file.arweaveKey ? file.arweaveLink : `ar://${file.arweaveId}`,
      type: file.fileType,
      fileName: file.fileName
    }))

  baseData.contentFingerprints = [
    ...new Set(
      data.fileRecords
        .map((r) => {
          const arweaveUrl = r.arweaveKey
            ? r.arweaveLink
            : `ar://${r.arweaveId}`
          return r.fileType === 'epub' || r.fileType === 'pdf'
            ? arweaveUrl
            : `ar://${r.arweaveId}`
        })
        .filter(Boolean)
    )
  ].map(url => ({ url }))

  return baseData
}

const calculateISCNFee = async () => {
  const estimation = await estimateISCNTxGasAndFee(
    formatISCNTxPayload(payload.value)
  )

  const { iscnFee: fee, gas: iscnGasEstimation } = estimation

  const iscnGasNanolike = new BigNumber(
    iscnGasEstimation.fee.amount[0].amount
  ).times(ISCN_GAS_MULTIPLIER)

  const iscnFeeNanolike = fee.amount
  iscnFee.value = new BigNumber(iscnFeeNanolike)
    .plus(iscnGasNanolike)
    .shiftedBy(-9)

  iscnGasFee.value = new BigNumber(iscnGasEstimation.fee.gas)
    .times(ISCN_GAS_MULTIPLIER)
    .toFixed(0)
}

const addContentFingerprint = () => {
  iscnData.value.contentFingerprints.push({
    url: ''
  })
}

const removeContentFingerprint = (index: number) => {
  if (iscnData.value.contentFingerprints.length > 1) {
    iscnData.value.contentFingerprints.splice(index, 1)
  }
}

const addDownloadableUrl = () => {
  iscnData.value.downloadableUrls.push({
    url: '',
    type: '',
    fileName: ''
  })
}

const removeDownloadableUrl = (index: number) => {
  if (iscnData.value.downloadableUrls.length > 1) {
    iscnData.value.downloadableUrls.splice(index, 1)
  }
}

const onSubmit = async (): Promise<void> => {
  uploadStatus.value = 'checking'

  if (!isFormValid.value) {
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: `Required field missing: ${error.value}`,
      timeout: 3000,
      color: 'red'
    })
    return
  }
  await calculateISCNFee()
  balance.value = await getAccountBalance(wallet.value)
  if (balance.value?.lt(totalFee.value)) {
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'INSUFFICIENT_BALANCE',
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
    uploadStatus.value = ''
    return
  }
  if (
    iscnData.value.contentFingerprints.length
  ) {
    await submitToISCN()
  }
}

const submitToISCN = async (): Promise<void> => {
  uploadStatus.value = 'loading'
  await initIfNecessary()

  if (!signer.value) {
    error.value = 'MISSING_SIGNER'
    uploadStatus.value = ''
    return
  }

  try {
    uploadStatus.value = 'signing'
    const res = await signISCNTx(
      formatISCNTxPayload(payload.value),
      signer.value,
      wallet.value,
      { gas: iscnGasFee.value }
    )
    uploadStatus.value = 'success'
    updateUploadFileData({ iscnRecord: res })
    emit('submit', res)
  } catch (err) {
    console.error(err)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: `'SIGNING_ERROR':${err as string}`,
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
    uploadStatus.value = ''
  } finally {
    balance.value = await getAccountBalance(wallet.value)
    uploadStatus.value = ''
  }
}

defineExpose({
  iscnData,
  onSubmit,
  isFormValid
})
</script>

<style scoped>
.grid {
  @apply w-full;
}
</style>

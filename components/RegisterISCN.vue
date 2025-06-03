<template>
  <div>
    <ISCNForm v-model="iscnData" />
    <UModal
      :model-value="!!uploadStatus"
      :prevent-close="true"
      :ui="{ base: 'p-4 gap-2' }"
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
        <UProgress animation="carousel" color="primary" class="w-full" />
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { BigNumber } from 'bignumber.js'
import { storeToRefs } from 'pinia'
import { getUploadFileData } from '~/utils/uploadFile'
import { useFileUpload } from '~/composables/useFileUpload'
import { estimateISCNTxGasAndFee, signISCNTx } from '~/utils/iscn'
import { useWalletStore } from '~/stores/wallet'
import { getAccountBalance } from '~/utils/cosmos'
import { ISCN_GAS_MULTIPLIER, MAX_DESCRIPTION_LENGTH } from '~/constant/index'

import { useISCN } from '~/composables/useISCN'
import { useToastComposable } from '~/composables/useToast'

const walletStore = useWalletStore()
const { getFileType } = useFileUpload()

const { wallet, signer } = storeToRefs(walletStore)
const { initIfNecessary } = walletStore
const { stripHtmlTags, formatLanguage } = useFileUpload()
const { showErrorToast } = useToastComposable()

const iscnData = ref({
  type: 'Book',
  title: '',
  description: '',
  isbn: '',
  publisher: '',
  publicationDate: '',
  author: {
    name: '',
    description: ''
  },
  license: 'All Rights Reserved',
  customLicense: '',
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
const emit = defineEmits(['handleSubmit', 'submit', 'formValidChange'])

const totalFee = computed(() => {
  return iscnFee.value || new BigNumber(0)
})

const { payload } = useISCN(iscnData)

const formError = computed(() => {
  const desc = iscnData.value.description || ''

  const requiredFields = {
    title: !!iscnData.value.title,
    description: desc ? desc.length <= MAX_DESCRIPTION_LENGTH : false,
    authorName: !!iscnData.value.author.name,
    contentUrl: !!iscnData.value.contentFingerprints.some(f => !!f.url)
  }

  return Object.entries(requiredFields)
    .find(([_, isValid]) => !isValid)?.[0]?.toUpperCase() || ''
})

const isFormValid = computed(() => {
  return !formError.value
})

watch(isFormValid, (val: boolean) => {
  emit('formValidChange', val)
}, { immediate: true })

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

  const baseData: any = {
    type: 'Book',
    title: data.epubMetadata?.title || '',
    description: stripHtmlTags(data.epubMetadata?.description || ''),
    isbn: '',
    publisher: '',
    publicationDate: new Date().toISOString().split('T')[0],
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
    language: formatLanguage(data.epubMetadata?.language || 'zh'),
    tags: data.epubMetadata?.tags || []
  }

  baseData.downloadableUrls = data.fileRecords
    .filter(r => r.fileType === 'application/pdf' || r.fileType === 'application/epub+zip')
    .map(file => ({
      url: file.arweaveKey ? file.arweaveLink : `ar://${file.arweaveId}`,
      type: getFileType(file.fileType),
      fileName: file.fileName
    }))

  baseData.contentFingerprints = [
    ...new Set(
      data.fileRecords
        .map((r) => {
          const arweaveUrl = r.arweaveKey
            ? r.arweaveLink
            : `ar://${r.arweaveId}`
          return r.fileType === 'application/epub+zip' || r.fileType === 'application/pdf'
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

const onSubmit = async (): Promise<void> => {
  uploadStatus.value = 'checking'

  if (!isFormValid.value) {
    showErrorToast(`Required field missing: ${error.value}`)
    return
  }
  await calculateISCNFee()
  balance.value = await getAccountBalance(wallet.value)
  if (balance.value?.lt(totalFee.value)) {
    showErrorToast('INSUFFICIENT_BALANCE')
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
    emit('submit', res)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    showErrorToast(`'SIGNING_ERROR':${err as string}`)
    uploadStatus.value = ''
  } finally {
    balance.value = await getAccountBalance(wallet.value)
    uploadStatus.value = ''
  }
}

defineExpose({
  onSubmit
})
</script>

<style scoped>
.grid {
  @apply w-full;
}
</style>

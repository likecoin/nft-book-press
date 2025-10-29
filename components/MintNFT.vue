<template>
  <div class="flex flex-col items-stretch grow space-y-4">
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      :actions="errorActions"
      @close="error = ''"
    />

    <LiteMintNFT
      ref="liteMintNFTRef"
      :iscn-data="iscnData"
      :iscn-id="iscnId"
      :should-show-submit="false"
      @submit="handleFinishMintNFT"
    />
  </div>
</template>

<script setup lang="ts">

const {
  getClassOwner,
  getClassMetadata,
  checkNFTClassIsBookNFT
} = useNFTContractReader()

const error = ref('')
const isLoading = ref(false)
const retryCount = ref(0)
const maxRetries = 3

const iscnOwner = ref('')
const iscnData = ref<any>(null)
const classId = ref('')
const liteMintNFTRef = ref<any>(null)

const emit = defineEmits(['submit', 'loadingChange'])

const errorActions = computed(() => {
  return [{
    label: $t('button.retry'),
    variant: 'solid' as const,
    color: 'red' as const,
    click: () => window.location.reload()
  }]
})

watch(isLoading, (val: boolean) => {
  emit('loadingChange', val)
  if (val) {
    error.value = ''
  }
}, { immediate: true })

const { t: $t } = useI18n()

useSeoMeta({
  title: () => $t('seo.mint_nft_book_title'),
  ogTitle: () => $t('seo.mint_nft_book_title')
})

const props = defineProps({
  iscnId: {
    type: String,
    default: ''
  }
})

watch(() => props.iscnId, async (val: string) => {
  if (val) {
    await fetchISCNById(props.iscnId)
  }
}, { immediate: true })

async function fetchISCNById (iscnId?: string, isRetry = false) {
  if (!iscnId) {
    return
  }
  try {
    if (!isRetry) {
      retryCount.value = 0
    }
    isLoading.value = true
    const isBookNFT = await checkNFTClassIsBookNFT(iscnId)
    if (!isBookNFT) {
      throw new Error('Invalid NFT Class ID')
    }
    const [data, owner] = await Promise.all([
      getClassMetadata(iscnId),
      getClassOwner(iscnId)
    ])
    if (!data) {
      throw new Error('Failed to fetch ISCN metadata')
    }
    iscnData.value = { contentMetadata: data, owner, '@id': iscnId }
    iscnOwner.value = owner as string
    classId.value = iscnId
    error.value = ''
    retryCount.value = 0
    isLoading.value = false
  } catch (err) {
    if (retryCount.value < maxRetries) {
      retryCount.value++
      const delay = retryCount.value * 1000
      setTimeout(() => {
        fetchISCNById(iscnId, true)
      }, delay)
    } else {
      error.value = $t('error.fetch_classid_failed') + err
      isLoading.value = false
    }
  }
}

function startNFTMintFlow () {
  liteMintNFTRef.value?.startNFTMintFlow()
}

function handleFinishMintNFT ({ classId: newClassId, nftMintCount }: { classId?: string, nftMintCount?: number } = {}) {
  classId.value = newClassId || ''

  emit('submit', {
    classId: newClassId || '',
    nftMintCount
  })
}

defineExpose({
  startNFTMintFlow
})

</script>

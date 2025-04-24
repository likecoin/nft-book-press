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
    <LiteMintNFT
      ref="liteMintNFTRef"
      :iscn-data="iscnData"
      :should-show-submit="false"
      @submit="handleFinishMintNFT"
    />
    <EditISCNMetadataModal
      ref="editISCNRef"
      v-model="showEditISCNModal"
      :class-id="classId"
      @save="onSaveISCN"
    />
  </div>
</template>

<script setup lang="ts">
import { NFT_DEFAULT_MINT_AMOUNT } from '~/constant'

const { LCD_URL } = useRuntimeConfig().public
const router = useRouter()
const route = useRoute()

const step = ref(1)
const error = ref('')
const isLoading = ref(false)

const iscnIdInput = ref('')
const iscnOwner = ref('')
const iscnData = ref<any>(null)
const classId = ref('')
const liteMintNFTRef = ref<any>(null)

const iscnId = computed(() => iscnData.value?.['@id'])

const formState = reactive({
  prefix: 'BOOKSN',
  mintCount: NFT_DEFAULT_MINT_AMOUNT,
  imageUrl: '',
  externalUrl: '',
  uri: '',
  maxSupply: undefined
})

const isFormValid = computed(() => {
  return liteMintNFTRef.value?.isFormValid
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
      iscnData.value.owner = owner
      step.value = 2
    }
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

function onClickMintByInputting () {
  liteMintNFTRef.value?.onClickMintByInputting()
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

function handleFinishMintNFT ({ classId: newClassId, nftMintCount }: { classId: string, nftMintCount: number } = {}) {
  classId.value = newClassId || ''

  emit('submit', {
    classId: newClassId || '',
    nftMintCount
  })
}

defineExpose({
  isFormValid,
  onISCNIDInput,
  onClickMintByInputting
})

</script>

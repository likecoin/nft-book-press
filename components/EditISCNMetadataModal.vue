<template>
  <UModal :model-value="showOpenModal" :ui="{ width: 'min-w-[80vw]' }">
    <UCard
      :ui="{
        header: { base: 'flex justify-between items-center' },
        body: { base: 'space-y-4' },
        footer: { base: 'flex justify-end items-center' },
      }"
    >
      <template #header>
        <h2 class="font-bold font-mono">
          ISCN Metadata
        </h2>

        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="handleClickBack"
        />
      </template>
      <UProgress
        v-if="isISCNLoading"
        animation="carousel"
        color="primary"
        class="w-full"
      />
      <ISCNForm
        v-else
        v-model="iscnData"
      />
      <template #footer>
        <div class="w-full flex justify-center items-center gap-2">
          <UButton color="gray" variant="soft" @click="handleClickBack">
            Cancel
          </UButton>
          <UButton
            color="primary"
            :loading="isSaving"
            :disabled="!isFormValid"
            @click="handleSave"
          >
            Save Changes
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { BigNumber } from 'bignumber.js'
import { storeToRefs } from 'pinia'
import { useNftStore } from '~/stores/nft'
import { useIscnStore } from '~/stores/iscn'
import { signISCNTx, formatISCNTxPayload } from '~/utils/iscn'
import { useWalletStore } from '~/stores/wallet'
import { ISCN_GAS_FEE, UPDATE_ISCN_GAS_MULTIPLIER } from '~/constant/index'
import { useISCN } from '~/composables/useISCN'

const iscnStore = useIscnStore()
const nftStore = useNftStore()
const toast = useToast()
const walletStore = useWalletStore()
const { wallet, signer } = storeToRefs(walletStore)
const { initIfNecessary } = walletStore
const route = useRoute()

const props = defineProps<{
  classId?: string
}>()

const showOpenModal = defineModel<boolean>('modelValue')

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'save', iscnId: string): void
}>()

const iscnId = ref('')
const classData = ref({} as any)
const isSaving = ref(false)
const isISCNLoading = ref(false)
const recordVersion = ref(0)

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
  license: 'All rights reserved',
  contentFingerprints: [{ url: '' }],
  downloadableUrls: [
    {
      url: '',
      type: '',
      fileName: ''
    }
  ],
  customLicense: '',
  language: '',
  bookInfoUrl: '',
  tags: [],
  coverUrl: ''
})

const { payload } = useISCN(iscnData)

const isFormValid = computed(() => {
  const requiredFields = {
    title: !!iscnData.value.title,
    description: !!iscnData.value.description,
    authorName: !!iscnData.value.author.name,
    contentUrl: !!iscnData.value.contentFingerprints.some(f => !!f.url)
  }

  return Object.entries(requiredFields)
    .find(([_, isValid]) => !isValid)?.[0]?.toUpperCase() || ''
})

watchEffect(async () => {
  if (route.query.iscn_id) {
    iscnId.value = (route.query.iscn_id as string).replace(/\/\d+$/, '')
  }
  if (showOpenModal.value && (props.classId || iscnId.value)) {
    try {
      isISCNLoading.value = true
      if (props.classId) {
        classData.value = await nftStore.lazyFetchClassMetadataById(
          props.classId
        )
        if (classData.value?.data?.parent) {
          const parent = classData.value.data.parent
          iscnId.value = `${parent?.iscn_id_prefix}`
        }
      }
      if (iscnId.value) {
        const data = await iscnStore.fetchISCNById(iscnId.value)
        if (data?.records?.[0]) {
          const record = data.records[0]
          const metadata = record.data.contentMetadata
          recordVersion.value = record.data.recordVersion

          // Parse sameAs URLs into downloadableUrls
          const downloadableUrls = metadata.sameAs
            ? metadata.sameAs.map(parseDownloadableUrl)
            : [
                {
                  url: '',
                  type: '',
                  fileName: ''
                }
              ]
          const tags: string[] = []
          if (metadata.keywords) {
            if (Array.isArray(metadata.keywords)) {
              tags.push(...metadata.keywords)
            } else {
              tags.push(...metadata.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k))
            }
          }

          iscnData.value = {
            ...metadata,
            recordNotes: record.data?.recordNotes,
            stakeholders: record.data?.stakeholders,
            type: metadata['@type'] || 'Book',
            title: metadata.name || '',
            description: metadata.description || '',
            isbn: metadata.isbn || '',
            publisher: metadata.publisher || '',
            publicationDate: metadata.datePublished || '',
            author: {
              name: metadata.author?.name || metadata.author || '',
              description: metadata.author?.description || ''
            },
            license: metadata.usageInfo || 'All Rights Reserved',
            contentFingerprints: record.data.contentFingerprints.map((url: string) => ({
              url
            })) || [{ url: '' }],
            downloadableUrls,
            customLicense: '',
            language: metadata.inLanguage || '',
            bookInfoUrl: metadata.url || '',
            tags,
            coverUrl: metadata.thumbnailUrl || ''
          }
        }
      }
    } catch (error) {
      console.error('Error fetching ISCN data:', error)
    } finally {
      isISCNLoading.value = false
    }
  }
})

function handleClickBack () {
  showOpenModal.value = false
}

function parseDownloadableUrl (url: string) {
  try {
    const urlObj = new URL(url)
    const fileName = urlObj.searchParams.get('name') || ''
    const [name, type] = fileName.split('.')
    return {
      url: url.split('?')[0],
      fileName: name,
      type: type || ''
    }
  } catch (e) {
    return {
      url,
      fileName: '',
      type: ''
    }
  }
}

async function handleSave () {
  await initIfNecessary()
  if (!wallet.value || !signer.value) {
    toast.add({
      title: 'Please login first',
      color: 'red'
    })
    return
  }
  if (!isFormValid.value) {
    toast.add({
      title: 'Please fill in all required fields',
      color: 'red'
    })
    return
  }
  isSaving.value = true
  try {
    await signISCNTx(
      formatISCNTxPayload(payload.value),
      signer.value,
      wallet.value,
      {
        iscnId: `${iscnId.value}/${recordVersion.value}`,
        gas: new BigNumber(ISCN_GAS_FEE)
          .multipliedBy(UPDATE_ISCN_GAS_MULTIPLIER)
          .toFixed(0)
      }
    )
    if (props.classId) {
      classData.value = await nftStore.fetchClassMetadataById(props.classId as string)
    }
    toast.add({
      title: 'ISCN updated successfully',
      color: 'blue'
    })
    emit('save', iscnId.value)
    handleClickBack()
  } catch (error) {
    toast.add({
      title: 'Failed to update ISCN',
      description: (error as Error).message,
      color: 'red'
    })
  } finally {
    isSaving.value = false
  }
}

</script>

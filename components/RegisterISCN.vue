<template>
  <div class="flex flex-col gap-6">
    <!-- Basic Info -->
    <UFormGroup label="Type" class="flex-1">
      <UInput v-model="iscnData.type" placeholder="Type" />
    </UFormGroup>

    <UFormGroup label="Title" class="flex-1" required>
      <UInput v-model="iscnData.title" placeholder="Enter ISCN title" />
    </UFormGroup>

    <UFormGroup label="Description" class="flex-1" required>
      <UTextarea v-model="iscnData.description" placeholder="Enter ISCN description" autoresize />
    </UFormGroup>

    <div class="grid grid-cols-3 gap-4">
      <UFormGroup label="ISBN">
        <UInput v-model="iscnData.isbn" placeholder="Enter ISBN" />
      </UFormGroup>

      <UFormGroup label="Publisher">
        <UInput v-model="iscnData.publisher" placeholder="Enter publisher name" />
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
    </div>

    <!-- Author Info -->
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Author Name" required>
        <UInput v-model="iscnData.author.name" placeholder="Enter author name" />
      </UFormGroup>

      <UFormGroup label="Author Description">
        <UTextarea v-model="iscnData.author.description" placeholder="Enter author description" autoresize />
      </UFormGroup>
    </div>

    <UFormGroup label="Author Avatar URL">
      <UInput v-model="iscnData.author.url" placeholder="Enter author avatar URL" />
    </UFormGroup>

    <UFormGroup label="License" class="flex-1">
      <UInput v-model="iscnData.license" placeholder="License" />
    </UFormGroup>

    <!-- Content Fingerprints -->
    <div class="border p-4 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium">
          Content Fingerprint
        </h3>
      </div>
      <div v-for="(fingerprint, index) in iscnData.contentFingerprints" :key="index" class="flex gap-4 items-end">
        <div class="flex justify-between items-end w-full gap-[8px]">
          <UFormGroup class="w-full" :label="`URL #${index + 1}`">
            <UInput v-model="fingerprint.url" class="w-full" placeholder="Enter fingerprint URL" />
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
      <div v-for="(download, index) in iscnData.downloadableUrls" :key="index" class="flex gap-4 items-end">
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
  </div>
</template>

<script setup lang="ts">
import { useFileUpload } from '~/composables/useFileUpload'
const { stripHtmlTags, formatLanguage } = useFileUpload()

interface UploadFileData {
  epubMetadata?: {
    epubFileName: string
    title: string
    author: string
    language: string
    coverData: string
    description: string
  }
  tags?: string[]
  thumbnailIpfsHash?: string
  fileRecords: Array<{
    fileName: string
    fileType: string
    arweaveId: string
    arweaveLink: string
    ipfsHash: string
  }>
}

const languageOptions = ref([
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' }
])

const iscnData = ref({
  type: 'book',
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
  license: 'All rights reserved',
  contentFingerprints: [{
    url: ''
  }],
  downloadableUrls: [{
    url: '',
    type: '',
    fileName: ''
  }],
  language: ''
})

onMounted(() => {
  const initialData = initializeFromSessionStorage()
  if (initialData) {
    iscnData.value = initialData
  }
})

const initializeFromSessionStorage = () => {
  if (process.server) { return null }

  try {
    const storedData = window.sessionStorage.getItem('uploadFileData')
    if (!storedData) { return null }

    const data: UploadFileData = JSON.parse(storedData)

    const baseData = {
      type: 'book',
      title: data.epubMetadata?.title || '',
      description: stripHtmlTags(data.epubMetadata?.description || ''),
      isbn: '',
      publisher: '',
      publicationDate: '',
      author: {
        name: data.epubMetadata?.author || '',
        description: '',
        url: ''
      },
      license: 'All rights reserved',
      contentFingerprints: [] as Array<{ url: string }>,
      downloadableUrls: [] as Array<{ url: string, type: string, fileName: string }>,
      language: formatLanguage(data.epubMetadata?.language || '')
    }

    const downloadableFiles = data.fileRecords.filter(
      record => record.fileType === 'epub' || record.fileType === 'pdf'
    )

    if (downloadableFiles.length) {
      baseData.downloadableUrls = downloadableFiles.map(file => ({
        url: file.arweaveLink,
        type: file.fileType,
        fileName: file.fileName
      }))
      baseData.contentFingerprints = [
        ...new Set(
          data.fileRecords.flatMap(record => [record.arweaveLink, `ipfs://${record.ipfsHash}`].filter(Boolean))
        )
      ].map(url => ({ url }))
    }

    if (baseData.contentFingerprints.length === 0) {
      baseData.contentFingerprints = [{ url: '' }]
    }
    if (baseData.downloadableUrls.length === 0) {
      baseData.downloadableUrls = [{ url: '', type: '', fileName: '' }]
    }

    return baseData
  } catch (error) {
    console.error('Error reading from sessionStorage:', error)
    return null
  }
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

defineExpose({
  iscnData
})
</script>

<style scoped>
.grid {
  @apply w-full;
}
</style>

<template>
  <div class="flex flex-col gap-6">
    <!-- Basic Info -->
    <UFormGroup label="Type" class="flex-1">
      <UInput v-model="iscnData.type" placeholder="Type" />
    </UFormGroup>

    <UFormGroup label="Title" class="flex-1" required>
      <UInput v-model="iscnData.title" placeholder="Enter ISCN title" />
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
    </div>

    <UFormGroup label="Description" class="flex-1">
      <UTextarea v-model="iscnData.description" placeholder="Enter ISCN description" />
    </UFormGroup>

    <!-- Author Info -->
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Author Name" required>
        <UInput v-model="iscnData.author.name" placeholder="Enter author name" />
      </UFormGroup>

      <UFormGroup label="Author Description">
        <UInput v-model="iscnData.author.description" placeholder="Enter author description" />
      </UFormGroup>
    </div>

    <UFormGroup label="Author Avatar URL">
      <UInput v-model="iscnData.author.url" placeholder="Enter author avatar URL" />
    </UFormGroup>

    <UFormGroup label="License" class="flex-1">
      <UInput v-model="iscnData.license" placeholder="License" :disabled="true" />
    </UFormGroup>

    <!-- Content Fingerprints -->
    <div class="border p-4 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium">
          Content Fingerprint
        </h3>
      </div>
      <div v-for="(fingerprint, index) in iscnData.contentFingerprints" :key="index" class="flex gap-4 items-end">
        <div class="grid grid-cols-2 gap-4 flex-1">
          <UFormGroup :label="`URL #${index + 1}`">
            <UInput v-model="fingerprint.url" placeholder="Enter fingerprint URL" />
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
interface UploadFileData {
  arweaveIds: string[]
  arweaveLinks: string[]
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
    fileSize: number
    fileType: string
    arweaveId: string
    arweaveLink: string
    ipfsHash: string
  }>
}

const stripHtmlTags = (html: string) => {
  if (!html) { return '' }
  return html.replace(/<[^>]*>/g, '').trim()
}

const initializeFromSessionStorage = () => {
  if (process.server) { return null }

  try {
    const storedData = window.sessionStorage.getItem('uploadFileData')
    if (!storedData) { return null }

    const data: UploadFileData = JSON.parse(storedData)

    // Initialize base data
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
      downloadableUrls: [] as Array<{ url: string, type: string, fileName: string }>
    }

    if (data.arweaveLinks?.length) {
      baseData.contentFingerprints = data.arweaveLinks.map(link => ({
        url: link
      }))
    }

    const downloadableFiles = data.fileRecords.filter(
      record => record.fileType === 'epub' || record.fileType === 'application/pdf'
    )

    if (downloadableFiles.length) {
      baseData.downloadableUrls = downloadableFiles.map(file => ({
        url: file.arweaveLink,
        type: file.fileType,
        fileName: file.fileName
      }))
    }

    // Ensure at least one empty entry for each array
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

// When using onMounted to ensure client-side execution
onMounted(() => {
  const initialData = initializeFromSessionStorage()
  if (initialData) {
    iscnData.value = initialData
  }
})

// Initialize with default values first
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
  }]
})

const addContentFingerprint = () => {
  iscnData.value.contentFingerprints.push({
    type: '',
    url: ''
  })
}

const removeContentFingerprint = (index: number) => {
  if (iscnData.value.contentFingerprints.length > 1) { // Prevent removing last item
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
  if (iscnData.value.downloadableUrls.length > 1) { // Prevent removing last item
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

<template>
  <div class="flex flex-col gap-6">
    <!-- Basic Info -->
    <UFormGroup label="Type" class="flex-1">
      <USelect
        v-model="formData.type"
        :options="typeOptions"
        placeholder="Select type"
      />
    </UFormGroup>

    <UFormGroup
      label="Title"
      :error="!formData.title && 'Title is required'"
      class="flex-1 text-left"
      required
    >
      <UInput
        v-model="formData.title"
        placeholder="Enter ISCN title"
      />
    </UFormGroup>

    <UFormGroup
      label="Description"
      class="flex-1 text-left"
      :hint="`${formData.description.length}/${MAX_DESCRIPTION_LENGTH}`"
      :error="descriptionError"
      required
    >
      <UTextarea
        v-model="formData.description"
        placeholder="Enter ISCN description"
        autoresize
      />
    </UFormGroup>

    <div class="grid grid-cols-3 gap-4">
      <UFormGroup label="ISBN">
        <UInput v-model="formData.isbn" placeholder="Enter ISBN" />
      </UFormGroup>

      <UFormGroup label="Publisher">
        <UInput
          v-model="formData.publisher"
          placeholder="Enter publisher name"
        />
      </UFormGroup>

      <UFormGroup label="Publication Date">
        <UInput
          v-model="formData.publicationDate"
          type="date"
          placeholder="Select date"
        />
      </UFormGroup>

      <UFormGroup label="Language" required>
        <USelect
          v-model="formData.language"
          :options="languageOptions"
          placeholder="Select language"
        />
      </UFormGroup>

      <UFormGroup label="Cover Image">
        <UInput
          v-model="formData.coverUrl"
          placeholder="ar://{arweave_id}"
          class="font-mono"
        />
      </UFormGroup>

      <UFormGroup :label="$t('form_labels.book_info')">
        <UInput
          v-model="formData.bookInfoUrl"
          placeholder="Enter book info URL"
        />
      </UFormGroup>
    </div>

    <!-- Author Info -->
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup
        label="Author Name"
        :error="!formData.author.name && 'Author name is required'"
        class="text-left"
        required
      >
        <UInput
          v-model="formData.author.name"
          placeholder="Enter author name"
        />
      </UFormGroup>

      <UFormGroup label="Author Description">
        <UTextarea
          v-model="formData.author.description"
          placeholder="Enter author description"
          autoresize
        />
      </UFormGroup>
    </div>

    <UFormGroup label="License" class="flex-1">
      <div class="space-y-2">
        <USelect
          v-model="formData.license"
          :options="licenseOptions"
          placeholder="Select license"
        />
        <UInput
          v-if="modelValue.license === 'Other'"
          v-model="formData.customLicense"
          placeholder="Enter custom license"
        />
      </div>
    </UFormGroup>

    <!-- Content Fingerprints -->
    <div class="flex flex-col border p-4 rounded-lg gap-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium">
          Content Fingerprint
        </h3>
      </div>
      <div
        v-for="(fingerprint, index) in formData.contentFingerprints"
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
            v-if="formData.contentFingerprints.length > 1"
            color="red"
            class="w-min"
            variant="soft"
            icon="i-heroicons-trash"
            @click="removeContentFingerprint(index)"
          />
        </div>
        <UButton
          v-if="index === formData.contentFingerprints.length - 1"
          variant="soft"
          icon="i-heroicons-plus"
          class="mb-[2px]"
          @click="addContentFingerprint"
        />
      </div>

      <div class="flex items-center justify-center">
        <UButton
          variant="soft"
          label="update Content Fingerprint"
          @click="shouldShowUploadModal = true"
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
        v-for="(download, index) in formData.downloadableUrls"
        :key="index"
        class="flex gap-4 items-end"
      >
        <div class="grid grid-cols-3 gap-4 flex-1">
          <UFormGroup label="Type">
            <USelect
              v-model="download.type"
              :options="downloadTypeOptions"
              placeholder="Select file type"
            />
          </UFormGroup>
          <UFormGroup label="URL">
            <UInput v-model="download.url" placeholder="Enter download URL" />
          </UFormGroup>
          <UFormGroup label="Filename">
            <UInput v-model="download.fileName" placeholder="Enter filename" />
          </UFormGroup>
        </div>
      </div>
      <UButton
        variant="soft"
        icon="i-heroicons-plus"
        class="mb-[2px]"
        @click="addDownloadableUrl"
      />
      <UButton
        v-if="formData.downloadableUrls?.length > 1"
        color="red"
        variant="soft"
        icon="i-heroicons-trash"
        @click="removeDownloadableUrl(formData.downloadableUrls.length - 1)"
      />
    </div>

    <UModal
      v-model="shouldShowUploadModal"
      :prevent-close="true"
      :ui="{ width: 'w-full max-w-[80vw]' }"
    >
      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { base: 'space-y-4' },
          footer: { base: 'flex justify-end items-center' },
        }"
      >
        <template #header>
          <h2 class="font-bold font-mono">
            Upload Files
          </h2>
        </template>
        <UploadForm
          ref="uploadFormRef"
          :default-encrypted="isContentFingerprintsEncrypted"
          @file-upload-status="(status) => (uploadStatus = status)"
          @file-ready="(records) => (fileRecords = records)"
          @submit="handleUploadSubmit"
        />
        <template #footer>
          <div class="w-full flex justify-center items-center gap-2">
            <UButton color="gray" variant="soft" @click="shouldShowUploadModal = false">
              Cancel
            </UButton>
            <UButton
              color="primary"
              :loading="false"
              :disabled="!hasFiles || shouldDisableAction"
              @click="startUpload"
            >
              Confirm Upload
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { typeOptions, licenseOptions, languageOptions, MAX_DESCRIPTION_LENGTH } from '~/constant/index'
import { useFileUpload } from '~/composables/useFileUpload'
import { getApiEndpoints } from '~/constant/api'
const { t: $t } = useI18n()

const downloadTypeOptions = [
  { label: 'EPUB', value: 'epub' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Image', value: 'image' },
  { label: 'Other', value: 'other' }
]

interface ISCNFormData {
  type: string
  title: string
  description: string
  isbn: string
  publisher: string
  publicationDate: string
  author: {
    name: string
    description: string
    url?: string
  }
  license: string
  customLicense: string
  contentFingerprints: Array<{ url: string }>
  downloadableUrls: Array<{
    url: string
    type: string
    fileName: string
  }>
  language: string
  bookInfoUrl: string
  tags: string[]
  coverUrl: string
}

const shouldShowUploadModal = ref(false)
const uploadFormRef = ref()
const fileRecords = ref([])
const uploadStatus = ref('')

const formData = defineModel<ISCNFormData>({ required: true })

const hasFiles = computed(() => {
  return fileRecords.value?.length > 0
})

const shouldDisableAction = computed(() => {
  return uploadStatus.value !== ''
})

const descriptionError = computed(() => {
  const desc = formData.value.description || ''
  if (!desc) {
    return 'Description is required'
  } else if (desc.length > MAX_DESCRIPTION_LENGTH) {
    return `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`
  }
  return ''
})

const isContentFingerprintsEncrypted = computed(() => {
  const contentFingerprints = formData.value.contentFingerprints.map(f => f.url)
  const apiEndpoints = getApiEndpoints()
  const arweaveLinkEndpoint = apiEndpoints.API_GET_ARWEAVE_V2_LINK
  return contentFingerprints.some((fingerprint) => {
    return !!fingerprint.startsWith(arweaveLinkEndpoint) || fingerprint.includes('?key=')
  })
})

const addContentFingerprint = () => {
  formData.value.contentFingerprints.push({ url: '' })
}

const removeContentFingerprint = (index: number) => {
  if (formData.value.contentFingerprints.length) {
    formData.value.contentFingerprints.splice(index, 1)
  }
}

const addDownloadableUrl = () => {
  formData.value.downloadableUrls.push({ url: '', type: '', fileName: '' })
}

const removeDownloadableUrl = (index: number) => {
  if (formData.value.downloadableUrls.length) {
    formData.value.downloadableUrls.splice(index, 1)
  }
}

const startUpload = async () => {
  await uploadFormRef.value.onSubmit()
}

const { getFileType } = useFileUpload()

const handleUploadSubmit = (uploadData: any) => {
  const { fileRecords } = uploadData
  if (!fileRecords.length) {
    return
  }

  const downloadableUrls = fileRecords
    .filter((r: any) => r.fileType === 'application/pdf' || r.fileType === 'application/epub+zip')
    .map((file: any) => ({
      url: file.arweaveKey ? file.arweaveLink : `ar://${file.arweaveId}`,
      type: getFileType(file.fileType),
      fileName: file.fileName
    }))

  const contentFingerprints = [
    ...new Set<string>(
      fileRecords
        .map((r: any) => {
          const arweaveUrl: string = r.arweaveKey
            ? r.arweaveLink
            : `ar://${r.arweaveId}`
          return r.fileType === 'application/epub+zip' || r.fileType === 'application/pdf'
            ? arweaveUrl
            : `ar://${r.arweaveId}`
        })
        .filter((r: string) => !!r)
    )
  ].map(url => ({ url }))

  formData.value.downloadableUrls = downloadableUrls
  formData.value.contentFingerprints = contentFingerprints

  shouldShowUploadModal.value = false
}
</script>

<style scoped>
.grid {
  @apply w-full;
}
</style>

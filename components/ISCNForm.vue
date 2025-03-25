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

    <UFormGroup label="Title" class="flex-1" required>
      <UInput v-model="formData.title" placeholder="Enter ISCN title" />
    </UFormGroup>

    <UFormGroup label="Description" class="flex-1" required>
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

      <UFormGroup label="書訊">
        <UInput
          v-model="formData.bookInfoUrl"
          placeholder="Enter book info URL"
        />
      </UFormGroup>
    </div>

    <!-- Author Info -->
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Author Name" required>
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
    <div class="border p-4 rounded-lg">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium">
          Content Fingerprint
        </h3>
      </div>
      <div
        v-for="(fingerprint, index) in modelValue.contentFingerprints"
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
            v-if="modelValue.contentFingerprints.length > 1"
            color="red"
            class="w-min"
            variant="soft"
            icon="i-heroicons-trash"
            @click="removeContentFingerprint(index)"
          />
        </div>
        <UButton
          v-if="index === modelValue.contentFingerprints.length - 1"
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
        v-for="(download, index) in modelValue.downloadableUrls"
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
      </div><UButton
        variant="soft"
        icon="i-heroicons-plus"
        class="mb-[2px]"
        @click="addDownloadableUrl"
      />
      <UButton
        v-if="modelValue.downloadableUrls.length > 1"
        color="red"
        variant="soft"
        icon="i-heroicons-trash"
        @click="removeDownloadableUrl(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { typeOptions, licenseOptions, languageOptions } from '~/constant/index'

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
    url: string
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

const props = defineProps<{
  modelValue: ISCNFormData
}>()

const emit = defineEmits<{(e: 'update:modelValue',
  value: ISCNFormData): void
}>()

const formData = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
  }
})

const isFormValid = computed(() => {
  const requiredFields = {
    title: !!props.modelValue.title,
    description: !!props.modelValue.description,
    authorName: !!props.modelValue.author.name,
    contentUrl: !!props.modelValue.contentFingerprints.some(f => !!f.url)
  }

  return Object.values(requiredFields).every(Boolean)
})

const addContentFingerprint = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    contentFingerprints: [...props.modelValue.contentFingerprints, { url: '' }]
  })
}

const removeContentFingerprint = (index: number) => {
  if (props.modelValue.contentFingerprints.length > 1) {
    const newFingerprints = [...props.modelValue.contentFingerprints]
    newFingerprints.splice(index, 1)
    emit('update:modelValue', {
      ...props.modelValue,
      contentFingerprints: newFingerprints
    })
  }
}

const addDownloadableUrl = () => {
  emit('update:modelValue', {
    ...props.modelValue,
    downloadableUrls: [...props.modelValue.downloadableUrls, { url: '', type: '', fileName: '' }]
  })
}

const removeDownloadableUrl = (index: number) => {
  if (props.modelValue.downloadableUrls.length > 1) {
    const newUrls = [...props.modelValue.downloadableUrls]
    newUrls.splice(index, 1)
    emit('update:modelValue', {
      ...props.modelValue,
      downloadableUrls: newUrls
    })
  }
}

defineExpose({
  isFormValid
})

</script>

<style scoped>
.grid {
  @apply w-full;
}
</style>

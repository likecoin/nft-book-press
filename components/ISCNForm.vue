<template>
  <div class="flex flex-col gap-6">
    <!-- Basic Info -->
    <UFormGroup label="Type" class="flex-1">
      <USelect
        v-model="modelValue.type"
        :options="typeOptions"
        placeholder="Select type"
      />
    </UFormGroup>

    <UFormGroup label="Title" class="flex-1" required>
      <UInput v-model="modelValue.title" placeholder="Enter ISCN title" />
    </UFormGroup>

    <UFormGroup label="Description" class="flex-1" required>
      <UTextarea
        v-model="modelValue.description"
        placeholder="Enter ISCN description"
        autoresize
      />
    </UFormGroup>

    <div class="grid grid-cols-3 gap-4">
      <UFormGroup label="ISBN">
        <UInput v-model="modelValue.isbn" placeholder="Enter ISBN" />
      </UFormGroup>

      <UFormGroup label="Publisher">
        <UInput
          v-model="modelValue.publisher"
          placeholder="Enter publisher name"
        />
      </UFormGroup>

      <UFormGroup label="Publication Date">
        <UInput
          v-model="modelValue.publicationDate"
          type="date"
          placeholder="Select date"
        />
      </UFormGroup>

      <UFormGroup label="Language">
        <USelect
          v-model="modelValue.language"
          :options="languageOptions"
          placeholder="Select language"
        />
      </UFormGroup>

      <UFormGroup label="Cover Image">
        <UInput
          v-model="modelValue.coverUrl"
          placeholder="ar://{arweave_id}"
          class="font-mono"
        />
      </UFormGroup>

      <UFormGroup label="書訊">
        <UInput
          v-model="modelValue.bookInfoUrl"
          placeholder="Enter book info URL"
        />
      </UFormGroup>
    </div>

    <!-- Author Info -->
    <div class="grid grid-cols-2 gap-4">
      <UFormGroup label="Author Name" required>
        <UInput
          v-model="modelValue.author.name"
          placeholder="Enter author name"
        />
      </UFormGroup>

      <UFormGroup label="Author Description">
        <UTextarea
          v-model="modelValue.author.description"
          placeholder="Enter author description"
          autoresize
        />
      </UFormGroup>
    </div>

    <UFormGroup label="License" class="flex-1">
      <div class="space-y-2">
        <USelect
          v-model="modelValue.license"
          :options="licenseOptions"
          placeholder="Select license"
        />
        <UInput
          v-if="modelValue.license === 'Other'"
          v-model="modelValue.customLicense"
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
        <UButton
          v-if="index === modelValue.downloadableUrls.length - 1"
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
  </div>
</template>

<script setup lang="ts">
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

const emit = defineEmits<{
  (e: 'update:modelValue', value: ISCNFormData): void
}>()

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' }
]

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
</script>

<style scoped>
.grid {
  @apply w-full;
}
</style>

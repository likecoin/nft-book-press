<template>
  <div
    :class="[
      'flex',
      'justify-center',
      { 'w-[138px]': props.size === 'large' },
      { 'w-[80px]': props.size === 'small' },
      'mr-[16px]',
      'overflow-hidden',
    ]"
  >
    <img
      v-if="computedFileType === 'image'"
      :class="['w-full', 'h-auto', 'object-contain', 'rounded-[8px]']"
      :src="props.fileData"
    >
    <UIcon
      v-else-if="computedFileType === 'epub'"
      name="i-heroicons-book-open"
      class="text-dark-gray w-[40px] h-[40px]"
    />
    <UIcon
      v-else
      name="i-heroicons-document"
      class="text-dark-gray w-[40px] h-[40px]"
    />
  </div>
</template>

<script setup lang="ts">
import { useFileUpload } from '~/composables/useFileUpload'

type FileTypes = 'image' | 'pdf' | 'epub' | 'other'

const { getFileType } = useFileUpload()

const props = defineProps({
  fileType: {
    type: String as PropType<FileTypes>,
    default: undefined
  },
  fileData: { type: String, default: undefined },
  size: { type: String, default: 'large' }
})

const computedFileType = computed(() => {
  // If formatted fileType is provided as a prop, use it directly
  if (props.fileType) { return props.fileType }

  // Extract MIME type from data URL
  const dataUrl = props.fileData || ''
  const mimeType = dataUrl.split(';')[0].split(':')[1] || ''

  // Use getFileType function to determine the file type based on MIME type
  return getFileType(mimeType)
})
</script>

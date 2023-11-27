<template>
  <UCard
    :ui="{
      header: { base: 'flex justify-between items-center gap-2' },
      body: { padding: '' },
      footer: { base: 'flex justify-center items-center gap-2' }
    }"
  >
    <div id="qr-code" ref="qrCodeRef" />
    <template #header>
      <slot name="header" />
    </template>

    <template #footer>
      <USelect
        v-model="extension"
        :options="[
          { value: 'svg', label: 'SVG' },
          { value: 'png', label: 'PNG' },
          { value: 'jpeg', label: 'JPEG' },
          { value: 'webp', label: 'WEBP' },
        ]"
      />

      <UButton
        label="Download"
        variant="outline"
        color="primary"
        @click="download"
      />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import QRCodeStyling, { FileExtension } from 'qr-code-styling'

import { getQRCodeOptions } from '~/utils/qrcode'

const props = defineProps({
  data: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 300
  }
})
const extension = ref('svg')
const options = computed(() => getQRCodeOptions({
  width: props.width,
  height: props.height,
  data: props.data
}))
const qrCode = ref<QRCodeStyling | null>(null)
const qrCodeRef = ref(null)

watch(() => props.data, () => {
  qrCode.value?.update(options.value)
})

onMounted(async () => {
  const { default: QRCodeStyling } = await import('qr-code-styling')
  qrCode.value = new QRCodeStyling(options.value)
  if (qrCodeRef.value) {
    qrCode.value.append(qrCodeRef.value)
  }
})

async function download () {
  const { default: QRCodeStyling } = await import('qr-code-styling')
  const tempInstance = new QRCodeStyling(options.value)
  tempInstance.download({ extension: extension.value as FileExtension, name: props.fileName })
}
</script>

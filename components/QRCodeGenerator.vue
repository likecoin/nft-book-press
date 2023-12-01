<template>
  <UCard
    :ui="{
      header: { base: 'flex justify-between items-center gap-2' },
      body: { padding: '' },
      footer: { base: 'flex justify-center items-center gap-2' }
    }"
  >
    <template #header>
      <slot name="header" />
    </template>

    <div class="p-4">
      <UFormGroup
        class="print:hidden"
        label="Pick a QR code icon"
      >
        <URadioGroup
          v-model="selectedIcon"
          :options="iconOptions"
        />
      </UFormGroup>
    </div>

    <UDivider />

    <div id="qr-code" ref="qrCodeRef" />

    <template #footer>
      <template v-if="isDownloadMode">
        <USelect
          v-model="downloadFileExtension"
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

      <UButton
        v-if="isConfigMode"
        label="Save Config"
        variant="outline"
        color="primary"
        @click="saveConfig"
      />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import QRCodeStyling, { FileExtension } from '@solana/qr-code-styling'

import { getQRCodeOptions, getQRCodeIcon, iconOptions, DEFAULT_QR_CODE_ICON } from '~/utils/qrcode'

const props = defineProps({
  data: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: DEFAULT_QR_CODE_ICON
  },
  width: {
    type: Number,
    default: 300
  },
  height: {
    type: Number,
    default: 300
  },
  mode: {
    type: String,
    default: 'download'
  }
})

const isDownloadMode = computed(() => props.mode === 'download')
const isConfigMode = computed(() => props.mode === 'config')

const selectedIcon = ref(props.icon)

const downloadFileExtension = ref('svg')

const emit = defineEmits(['save', 'update:icon'])

const options = computed(() => getQRCodeOptions({
  width: props.width,
  height: props.height,
  data: props.data,
  image: getQRCodeIcon(selectedIcon.value)
}))
const qrCode = ref<QRCodeStyling | null>(null)
const qrCodeRef = ref(null)

watch([selectedIcon, () => props.data], () => {
  qrCode.value?.update(options.value)
})

onMounted(async () => {
  const { default: QRCodeStyling } = await import('@solana/qr-code-styling')
  qrCode.value = new QRCodeStyling(options.value)
  if (qrCodeRef.value) {
    qrCode.value.append(qrCodeRef.value)
  }
})

async function download () {
  const { default: QRCodeStyling } = await import('@solana/qr-code-styling')
  const tempInstance = new QRCodeStyling(options.value)
  tempInstance.download({ extension: downloadFileExtension.value as FileExtension, name: props.fileName })
}

function saveConfig () {
  emit('update:icon', selectedIcon.value)
  emit('save', { icon: selectedIcon.value })
}
</script>

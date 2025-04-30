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

    <div v-if="!isReadonlyMode" class="grid grid-cols-2 gap-4 p-4 print:hidden">
      <UFormGroup label="Pick an icon">
        <URadioGroup
          v-model="selectedIcon"
          :options="iconOptions"
        />
      </UFormGroup>

      <UFormGroup label="Pick a color">
        <UInput
          v-model="selectedColor"
          type="color"
          :placeholder="DEFAULT_QR_CODE_COLOR"
        />
      </UFormGroup>
    </div>

    <UDivider v-if="!isReadonlyMode" />

    <div
      id="qr-code"
      ref="qrCodeRef"
      class="flex justify-center items-center py-2"
    />

    <template v-if="!isReadonlyMode" #footer>
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
import QRCodeStyling, { type FileExtension } from '@likecoin/qr-code-styling'

import { getQRCodeOptions, getQRCodeIcon, iconOptions, DEFAULT_QR_CODE_ICON, DEFAULT_QR_CODE_COLOR } from '~/utils/qrcode'

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
  color: {
    type: String,
    default: DEFAULT_QR_CODE_COLOR
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

const isReadonlyMode = computed(() => props.mode === 'readonly')
const isDownloadMode = computed(() => props.mode === 'download')
const isConfigMode = computed(() => props.mode === 'config')

const selectedIcon = ref(props.icon)
const selectedColor = ref(props.color)

const downloadFileExtension = ref('svg')

const emit = defineEmits(['save', 'update:icon', 'update:color'])

const options = computed(() => getQRCodeOptions({
  width: props.width,
  height: props.height,
  data: props.data,
  fillColor: selectedColor.value,
  image: selectedIcon.value === 'none' ? undefined : getQRCodeIcon(selectedIcon.value)
}))
const qrCode = ref<QRCodeStyling | null>(null)
const qrCodeRef = ref(null)

watch([selectedIcon, selectedColor, () => props.data], () => {
  qrCode.value?.update(options.value)
})

onMounted(async () => {
  const { default: QRCodeStyling } = await import('@likecoin/qr-code-styling')
  qrCode.value = new QRCodeStyling(options.value)
  if (qrCodeRef.value) {
    qrCode.value.append(qrCodeRef.value)
  }
})

async function download () {
  const { default: QRCodeStyling } = await import('@likecoin/qr-code-styling')
  const tempInstance = new QRCodeStyling(options.value)
  tempInstance.download({ extension: downloadFileExtension.value as FileExtension, name: props.fileName })
}

function saveConfig () {
  emit('update:icon', selectedIcon.value)
  emit('update:color', selectedColor.value)
  emit('save', { icon: selectedIcon.value, color: selectedColor.value })
}
</script>

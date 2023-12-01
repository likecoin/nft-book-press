<template>
  <main class="space-y-4 print:space-y-0">
    <h1 class="text-lg font-bold font-mono print:hidden">
      Batch Create QR Codes
    </h1>

    <UFormGroup
      label="Upload CSV file"
      class="print:hidden"
    >
      <UInput type="file" accept="csv" @change="handleFileChange" />
    </UFormGroup>
    <UDivider class="print:hidden" label="OR" />
    <UFormGroup
      class="print:hidden"
      label="Input CSV content"
    >
      <UTextarea
        v-model="csvInput"
        class="font-mono"
        :placeholder="csvInputPlaceholder"
        :resize="true"
      />
    </UFormGroup>

    <nav class="flex justify-center items-center gap-2 print:hidden">
      <UButton
        v-if="urlItems.length <= 0"
        label="Generate"
        size="lg"
        :disabled="!csvInput"
        @click="drawQRCodes"
      />
      <UButton
        v-else
        label="Print"
        size="lg"
        variant="outline"
        @click="handleClickPrint"
      />
    </nav>

    <div class="flex flex-col items-center gap-[2cm] print:gap-0">
      <ul
        v-for="(items, page) in pagesForPrint"
        :key="page"
        class="w-[20cm] grid grid-cols-3 items-center gap-[0.25cm] py-[0.5cm] break-before-page"
      >
        <li
          v-for="item in items"
          :key="item.key || item.url"
        >
          <figure ref="qrCodeRef" class="qrcode">
            <figcaption class="text-xs text-center font-mono">
              {{ item.key }}
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </main>
</template>

<script setup lang="ts">
import { parse as csvParse } from 'csv-parse/sync'

import { getQRCodeOptions } from '~/utils/qrcode'

import NFCIcon from '~/assets/images/nfc.png'

definePageMeta({ layout: 'page' })

const toast = useToast()

const csvInput = ref('')
const csvInputPlaceholder = `key,url
example01,https://example01.com
example02,https://example02.com`

const qrCodeRef = ref<HTMLElement[] | undefined>(undefined)
const urlItems = ref<{ key: string, url: string }[]>([])

const ITEMS_PER_PAGE = 12

const pagesForPrint = computed(() => {
  // split urlItems into chunks of 12 items
  const chunks = []
  for (let i = 0; i < urlItems.value.length; i += ITEMS_PER_PAGE) {
    chunks.push(urlItems.value.slice(i, i + ITEMS_PER_PAGE))
  }
  return chunks
})

watch(csvInput, () => {
  urlItems.value = []
})

onMounted(() => {
  try {
    const loadedInput = localStorage.getItem('nft_book_press_batch_qrcode')
    if (loadedInput) {
      csvInput.value = loadedInput
      localStorage.removeItem('nft_book_press_batch_qrcode')
    }
    nextTick(() => {
      if (csvInput.value) {
        drawQRCodes()
      }
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
})

async function drawQRCodes () {
  try {
    urlItems.value = csvParse(csvInput.value, {
      columns: true,
      skip_empty_lines: true
    }) as { key: string, url: string }[]
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Failed to parse CSV input',
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  }

  const { default: QRCodeStyling } = await import('@solana/qr-code-styling')
  urlItems.value.forEach((item, index: number) => {
    const qrcode = new QRCodeStyling(getQRCodeOptions({
      margin: 0,
      data: item.url,
      image: NFCIcon,
      fillColor: '#0a2439'
    }))
    const element = qrCodeRef.value?.[index]
    if (element) {
      element.querySelector('svg')?.remove()
      qrcode.append(element)

      // HACK: Add viewBox attribute to fix the auto resize of SVG
      element.querySelector('svg')?.setAttribute('viewBox', '0 0 300 300')
    }
  })
}

function handleFileChange (event: Event) {
  if (!event?.target) {
    return
  }

  const files = (event.target as HTMLInputElement)?.files
  if (!files) {
    return
  }

  const [file] = files
  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result
    if (typeof text === 'string') {
      csvInput.value = text
    }
  }
  reader.readAsText(file)
}

function handleClickPrint () {
  if (csvInput.value) {
    window.print()
  }
}
</script>

<style>
figure.qrcode > svg {
  @apply w-[6.2cm] h-[6.2cm] border p-[0.2cm];
}
</style>

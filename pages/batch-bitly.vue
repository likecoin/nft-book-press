<template>
  <main class="space-y-4">
    <h1 class="text-xl font-bold font-mono ">
      Batch Create Bitly Links
    </h1>
    <UFormGroup
      label="Bitly Access Token"
      :required="true"
    >
      <UInput
        v-model="bitlyToken"
        class="font-mono"
        :required="true"
      />
    </UFormGroup>

    <UFormGroup label="Title Prefix">
      <UInput
        v-model="titlePrefix"
        hint="Optional"
      />
    </UFormGroup>

    <UCard :ui="{ body: { base: 'space-y-2' } }">
      <UFormGroup label="Upload CSV file">
        <UInput type="file" accept="csv" @change="handleFileChange" />
      </UFormGroup>
      <UDivider class="print:hidden" label="OR" />
      <UFormGroup label="Input CSV content">
        <UTextarea
          v-model="csvInput"
          class="font-mono"
          :placeholder="csvInputPlaceholder"
          :resize="true"
        />
      </UFormGroup>
    </UCard>

    <div class="flex justify-center">
      <UButton
        label="Start"
        size="lg"
        :disabled="!csvInput || !bitlyToken"
        @click="startShorteningURLs"
      />
    </div>

    <template v-if="shortenedURLItems.length">
      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center gap-2' },
          body: { padding: '' }
        }"
      >
        <template #header>
          <h3 class="font-bold font-mono">
            Results
          </h3>

          <div class="flex items-center gap-2">
            <UButton
              label="Download CSV"
              variant="outline"
              @click="downloadAllShortenedLinks"
            />
            <UButton
              label="Convert to QR Codes"
              variant="outline"
              @click="convertToQRCode"
            />
          </div>
        </template>

        <UTable
          :columns="[
            { key: 'key', label: 'Key' },
            { key: 'url', label: 'URL' },
            { key: 'destination', label: 'Destination' },
          ]"
          :rows="shortenedURLItems"
        >
          <template #url-data="{ row }">
            <UButton
              class="font-mono"
              :to="row.url"
              target="_blank"
              rel="noopener noreferrer"
              variant="link"
              :padded="false"
            >
              {{ row.url }}
            </UButton>
          </template>
          <template #destination-data="{ row }">
            <UButton
              class="font-mono"
              :to="row.destination"
              target="_blank"
              rel="noopener noreferrer"
              variant="link"
              :padded="false"
            >
              {{ row.destination }}
            </UButton>
          </template>
        </UTable>
      </UCard>
    </template>
  </main>
</template>

<script setup lang="ts">
import axios from 'axios'
import { parse as csvParse } from 'csv-parse/sync'

import { convertArrayOfObjectsToCSV } from '~/utils'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const titlePrefix = ref(route.query.title_prefix as string || 'NFT Book Press')
const csvInput = ref('')
const csvInputPlaceholder = `key,url
example01,https://example01.com,
example02,https://example02.com,`
const bitlyToken = ref('')
const shortenedURLItems = ref<{ key: string, url: string }[]>([])

onMounted(() => {
  try {
    const loadedInput = localStorage.getItem('nft_book_press_batch_shorten_url')
    if (loadedInput) {
      csvInput.value = loadedInput
      localStorage.removeItem('nft_book_press_batch_shorten_url')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
})

async function shortenURL ({ url, key }: { url: string, key: string }) {
  try {
    const response = await axios.post('https://api-ssl.bitly.com/v4/bitlinks', {
      long_url: url,
      domain: 'bit.ly',
      title: [titlePrefix.value, key].join(' - '),
      tags: [
        'nft-book-press'
      ]
    }, {
      headers: {
        Authorization: `Bearer ${bitlyToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    return response.data.link
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: (error as Error).toString(),
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
    return 'error'
  }
}

async function startShorteningURLs () {
  let urlItems: { key: string, url: string }[] = []
  try {
    urlItems = csvParse(csvInput.value, {
      columns: true,
      skip_empty_lines: true
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: (error as Error).toString(),
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
    return
  }

  try {
    shortenedURLItems.value = await Promise.all(urlItems.map(async ({ key, url }) => {
      const shortenedURL = await shortenURL({ url, key })
      return {
        key,
        url: shortenedURL,
        destination: url
      }
    }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: (error as Error).toString(),
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  }
}

function downloadAllShortenedLinks () {
  downloadFile({
    data: shortenedURLItems.value,
    fileName: 'shortened_links.csv',
    fileType: 'csv'
  })
}

function convertToQRCode () {
  localStorage.setItem('nft_book_press_batch_qrcode', convertArrayOfObjectsToCSV(shortenedURLItems.value))
  router.push({ name: 'batch-qrcode' })
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

</script>

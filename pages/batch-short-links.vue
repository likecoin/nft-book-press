<template>
  <PageContainer>
    <PageHeader title="Batch Create Short Links" />

    <PageBody>
      <UFormGroup
        label="Short Link Provider"
        :required="true"
      >
        <USelect
          v-model="shortLinkProvider"
          :options="shortLinkProviders"
        />
      </UFormGroup>

      <UFormGroup
        :label="apiKeyLabel"
        :required="true"
      >
        <UInput
          v-model="apiKey"
          class="font-mono"
          :autocomplete="false"
        />
      </UFormGroup>

      <UFormGroup
        v-if="shouldShowShortLinkDomain"
        label="Short.io Domain"
        :required="true"
      >
        <UInput
          v-model="shortLinkDomain"
          class="font-mono"
          placeholder="link.liker.land"
          :autocomplete="false"
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
          :disabled="!csvInput || !apiKey || (shouldShowShortLinkDomain && !shortLinkDomain)"
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
                rel="noopener"
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
                rel="noopener"
                variant="link"
                :padded="false"
              >
                {{ row.destination }}
              </UButton>
            </template>
          </UTable>
        </UCard>
      </template>
    </PageBody>
  </PageContainer>
</template>

<script setup lang="ts">
import { parse as csvParse } from 'csv-parse/sync'

import { convertArrayOfObjectsToCSV } from '~/utils'

const toast = useToast()
const route = useRoute()
const router = useRouter()

enum ShortLinkProvider {
  Bitly = 'bitly',
  ShortIO = 'shortio'
}
const shortLinkProviders = [
  {
    label: 'Bitly',
    value: ShortLinkProvider.Bitly
  },
  {
    label: 'Short.io',
    value: ShortLinkProvider.ShortIO
  }
]
const shortLinkProvider = ref(route.query.provider as string || ShortLinkProvider.Bitly)
const shouldShowShortLinkDomain = computed(() => shortLinkProvider.value === ShortLinkProvider.ShortIO)
const shortLinkDomain = ref('')

const titlePrefix = ref(route.query.title_prefix as string || 'NFT Book Press')
const csvInput = ref('')
const csvInputPlaceholder = `key,url
example01,https://example01.com,
example02,https://example02.com,`
const apiKey = ref('')
const apiKeyLabel = computed(() => {
  switch (shortLinkProvider.value) {
    case ShortLinkProvider.Bitly:
      return 'Bitly Access Token'
    case ShortLinkProvider.ShortIO:
      return 'Short.io API Key'
    default:
      return ''
  }
})
const shortenedURLItems = ref<{ key: string, url: string, destination: string }[]>([])

onMounted(() => {
  try {
    const loadedInput = sessionStorage.getItem('nft_book_press_batch_shorten_url')
    if (loadedInput) {
      csvInput.value = loadedInput
      sessionStorage.removeItem('nft_book_press_batch_shorten_url')
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
})

async function shortenURLWithBitly ({ url, key }: { url: string, key: string }) {
  try {
    const { data, error } = await useFetch<{ link: string }>('https://api-ssl.bitly.com/v4/bitlinks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.value}`
      },
      body: {
        long_url: url,
        domain: 'bit.ly',
        title: [titlePrefix.value, key].join(' - '),
        tags: [
          'nft-book-press'
        ]
      }
    })
    if (error.value) {
      throw error.value
    }
    if (!data.value) {
      throw new Error('No data returned from Bitly')
    }
    return data.value.link
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

async function shortenURLWithShortIO ({ url, key }: { url: string, key: string }) {
  try {
    const { data, error } = await useFetch<{ shortURL: string }>('https://api.short.io/links/public', {
      method: 'POST',
      headers: {
        Authorization: apiKey.value
      },
      body: {
        allowDuplicates: true,
        domain: shortLinkDomain.value,
        originalURL: url,
        title: [titlePrefix.value, key].join(' - '),
        tags: [
          'nft-book-press'
        ]
      }
    })
    if (error.value) {
      throw error.value
    }
    if (!data.value) {
      throw new Error('No data returned from Short.io')
    }
    return data.value.shortURL
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
    for (const { key, url } of urlItems) {
      let shortenedURL = ''
      switch (shortLinkProvider.value) {
        case ShortLinkProvider.Bitly:
          shortenedURL = await shortenURLWithBitly({ url, key })
          break
        case ShortLinkProvider.ShortIO:
          shortenedURL = await shortenURLWithShortIO({ url, key })
          break
        default:
          break
      }
      shortenedURLItems.value.push({
        key,
        url: shortenedURL,
        destination: url
      })
    }
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
  sessionStorage.setItem('nft_book_press_batch_qrcode', convertArrayOfObjectsToCSV(shortenedURLItems.value))
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

<template>
  <PageContainer>
    <PageHeader title="Generate Affiliation Links" />

    <PageBody class="flex flex-col items-stretch grow space-y-4">
      <UCard v-if="!productData" :ui="{ body: { base: 'space-y-4' }, footer: { base: 'flex justify-end' } }">
        <UFormGroup
          label="Product ID"
          :required="true"
          :error="error"
        >
          <UInput
            v-model="productIdInput"
            class="font-mono"
            placeholder="Enter NFT Class ID/Collection ID"
            :required="true"
          />
        </UFormGroup>

        <UFormGroup label="Link Settings">
          <USelect v-model="linkSetting" :options="linkSettings" option-attribute="name" />
        </UFormGroup>

        <UFormGroup
          v-if="isCustomLink"
          label="Custom Link"
          :required="true"
        >
          <UInput
            v-model="customLinkInput"
            class="font-mono"
            placeholder="https://books.liker.land"
            :required="true"
          />
        </UFormGroup>

        <UFormGroup label="Custom Channels" hint="Optional">
          <UInput
            v-model="customChannelInput"
            class="font-mono"
            placeholder="Channel ID(s), separated by commas (e.g. store01, store02)"
          />
        </UFormGroup>

        <UFormGroup label="Query Parameters" hint="Optional">
          <UInput
            v-model="linkQueryInput"
            class="font-mono"
            placeholder="utm_source=instagram&utm_medium=social"
          />
        </UFormGroup>

        <template #footer>
          <UButton
            label="Generate"
            size="lg"
            :disabled="!productIdInput || isLoadingProductData"
            :loading="isLoadingProductData"
            @click="createAffiliationLink"
          />
        </template>
      </UCard>

      <UCard
        v-else
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { base: 'divide-y divide-gray-200 dark:divide-gray-800', padding: '' }
        }"
      >
        <template #header>
          <div class="flex items-center gap-4">
            <UButton
              icon="i-heroicons-arrow-uturn-left"
              label="Back"
              variant="soft"
              @click="productData = undefined"
            />

            <h2 class="font-bold">
              {{ tableTitle }}
            </h2>
          </div>

          <UDropdown
            :items="[
              [
                {
                  label: 'Print All QR Codes',
                  icon: 'i-heroicons-qr-code',
                  click: printAllQRCodes,
                },
                {
                  label: 'Download QR Codes',
                  icon: 'i-heroicons-arrow-down-on-square-stack',
                  click: downloadAllQRCodes,
                },
                {
                  label: 'Download All Links',
                  icon: 'i-heroicons-arrow-down-on-square-stack',
                  click: downloadAllPurchaseLinks,
                },
                {
                  label: 'Shorten All Links',
                  icon: 'i-heroicons-sparkles',
                  click: shortenAllLinks,
                },
              ]
            ]"
            :popper="{ placement: 'top-end' }"
          >
            <UButton
              icon="i-heroicons-ellipsis-horizontal-20-solid"
              color="gray"
              variant="soft"
            />
          </UDropdown>
        </template>

        <div v-if="priceIndexOptions.length" class="px-4 py-5 sm:p-6">
          <UFormGroup label="Edition">
            <USelect
              v-model="priceIndex"
              :options="priceIndexOptions"
            />
          </UFormGroup>
        </div>

        <div
          v-if="linkQueryTableRows.length"
          class="px-4 py-5 sm:p-6"
        >
          <UCard
            :ui="{ body: { padding: '' } }"
          >
            <template #header>
              <h3 class="text-sm font-bold">
                Link Query Parameters
              </h3>
            </template>

            <UTable
              :columns="[
                { key: 'key', label: 'Key' },
                { key: 'value', label: 'Value' }
              ]"
              :rows="linkQueryTableRows"
              :ui="{ td: { font: 'font-mono' } }"
            />
          </UCard>
        </div>

        <UTable :columns="tableColumns" :rows="tableRows">
          <template #link-data="{ row }">
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-qr-code"
                variant="outline"
                size="xs"
                @click="selectedPurchaseLink = row"
              />
              <UButton
                icon="i-heroicons-document-duplicate"
                variant="outline"
                size="xs"
                @click="copyLink(row.url || '')"
              />
              <UButton
                class="font-mono break-all"
                :label="row.url"
                :to="row.url"
                color="gray"
                variant="outline"
                size="xs"
                target="_blank"
              />
            </div>
          </template>
        </UTable>
      </UCard>

      <UModal v-model="isOpenQRCodeModal">
        <QRCodeGenerator
          v-if="selectedPurchaseLink"
          :data="selectedPurchaseLink.url"
          :file-name="getQRCodeFilename(selectedPurchaseLink.channel)"
          :width="500"
          :height="500"
        >
          <template #header>
            <h3 class="font-bold font-mono">
              Download QR Code
            </h3>
            <UButton
              icon="i-heroicons-x-mark"
              color="gray"
              variant="ghost"
              @click="isOpenQRCodeModal = false"
            />
          </template>
        </QRCodeGenerator>
      </UModal>
    </PageBody>
  </PageContainer>
</template>

<script setup lang="ts">
import { type FileExtension } from '@likecoin/qr-code-styling'
import { AFFILIATION_CHANNELS, LIKE_CO_API } from '~/constant'
import { useCollectionStore } from '~/stores/collection'
import { getPurchaseLink } from '~/utils'

const collectionStore = useCollectionStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const productIdInput = ref(route.query.product_id as string || '')
const productId = computed(() => {
  if (!productIdInput.value) {
    return ''
  }
  const input = productIdInput.value.trim()
  if (input.startsWith('http')) {
    const url = new URL(input)
    const id = url.pathname.split('/').pop()
    if (id?.startsWith('col_') || id?.startsWith('likenft')) {
      return id
    }
  }
  return input
})

const linkQueryInput = ref('utm_medium=qrcode')
const linkQuery = computed(() => {
  if (linkQueryInput.value) {
    return Object.fromEntries(new URLSearchParams(linkQueryInput.value.trim()))
  }
  const input = productIdInput.value?.trim() || ''
  if (input.startsWith('http')) {
    return Object.fromEntries(new URL(input).searchParams)
  }
  return {}
})
const linkQueryTableRows = computed(() => Object.entries(linkQuery.value).map(([key, value]) => ({
  key,
  value
})))

const isCollection = computed(() => productId.value?.startsWith('col_'))

const linkSettings = ref([
  {
    name: 'Use Liker Land Link (Product page)',
    value: 'liker_land'
  },
  {
    name: 'Direct Link (Stripe)',
    value: 'direct'
  },
  {
    name: 'Custom Link',
    value: 'custom'
  }
])
const linkSetting = ref(linkSettings.value[0].value)
const isCustomLink = computed(() => linkSetting.value === 'custom')
const customLinkInput = ref(route.query.custom_link as string || '')

const customChannelInput = ref('')
const customChannels = computed(
  () => customChannelInput.value
    .split(',')
    .map(channel => channel.trim())
    .filter(Boolean)
    .map(channel => ({
      id: channel,
      name: channel
    }))
)

const error = ref('')

const isLoadingProductData = ref(false)
const productData = ref<any>(undefined)
const productName = computed(() => {
  if (!productData.value) {
    return ''
  }
  const name = productData.value?.name
  if (isCollection.value && name) {
    return name.zh || name.en
  }
  return name
})
const priceIndex = ref(0)
const priceIndexOptions = computed(() => {
  if (!productData.value || isCollection.value) {
    return []
  }
  return productData.value?.prices.map((price: any) => ({
    label: price.name?.zh || price.name?.en || price.name,
    value: price.index
  }))
})

const tableTitle = computed(() => `${productName.value} Affiliation Links`)
const tableColumns = [
  {
    key: 'channel',
    label: 'Channel',
    sortable: true
  },
  {
    key: 'link',
    label: 'Link',
    sortable: false
  }
]
const tableRows = computed(() => {
  if (!productData.value) {
    return []
  }
  const channels = [...AFFILIATION_CHANNELS, ...customChannels.value]
  channels.sort((a, b) => {
    if (a.id === 'liker_land') {
      return -1
    }
    if (b.id === 'liker_land') {
      return 1
    }
    return a.id.replace('@', '').localeCompare(b.id.replace('@', ''))
  })
  return channels.map(channel => ({
    id: channel.id,
    channel: channel.name,
    url: getPurchaseLink({
      [isCollection.value ? 'collectionId' : 'classId']: productId.value,
      channel: channel.id,
      priceIndex: priceIndex.value,
      customLink: isCustomLink.value ? customLinkInput.value : undefined,
      isUseLikerLandLink: linkSetting.value === 'liker_land',
      query: linkQuery.value
    })
  }))
})

const selectedPurchaseLink = ref<{
  channel: string,
  url: string,
} | undefined>(undefined)
const isOpenQRCodeModal = computed({
  get: () => !!selectedPurchaseLink.value,
  set: (value) => {
    if (!value) {
      selectedPurchaseLink.value = undefined
    }
  }
})

async function fetchProductData () {
  try {
    if (isCollection.value) {
      return collectionStore.lazyFetchCollectionById(productId.value)
    } else {
      const { data: classData, error: classFetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/store/${productId.value}`)
      if (classFetchError.value) {
        error.value = 'Cannot fetch class data.'
      } else {
        return classData.value
      }
    }
  } catch {
    error.value = 'Cannot fetch product data.'
  }
  return undefined
}

async function createAffiliationLink () {
  error.value = ''
  productData.value = undefined

  if (!productId.value) {
    return
  }

  isLoadingProductData.value = true
  const data = await fetchProductData()
  isLoadingProductData.value = false
  if (data) {
    productData.value = data
  }
}

function getQRCodeFilename (channel = '') {
  const filenameParts = [`${productName.value || productId.value}`]
  if (!isCollection.value) {
    filenameParts.push(`price_${priceIndex.value}`)
  }
  if (channel) {
    filenameParts.push(`channel_${channel}`)
  }
  return filenameParts.join('_')
}

async function copyLink (text = '') {
  await navigator.clipboard.writeText(text)
  toast.add({
    icon: 'i-heroicons-check-circle',
    title: 'Copied link to clipboard',
    timeout: 2000,
    color: 'green'
  })
}

function downloadAllPurchaseLinks () {
  downloadFile({
    data: tableRows.value,
    fileName: `${productName.value}_purchase_links.csv`,
    fileType: 'csv'
  })
}

function printAllQRCodes () {
  try {
    sessionStorage.setItem(
      'nft_book_press_batch_qrcode',
      convertArrayOfObjectsToCSV(tableRows.value.map(({ channel, ...link }) => ({ key: channel, ...link })))
    )
    window.open('/batch-qrcode?print=1', 'batch_qrcode', 'popup,menubar=no,location=no,status=no')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Failed to print QR codes',
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  }
}

function shortenAllLinks () {
  try {
    sessionStorage.setItem(
      'nft_book_press_batch_shorten_url',
      convertArrayOfObjectsToCSV(tableRows.value.map(({ channel, ...link }) => ({ key: channel, ...link })))
    )
    router.push({ name: 'batch-bitly', query: { print: 1 } })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Failed to shorten links',
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  }
}

// TODO: UI for file types selection
const DOWNLOAD_QRCODE_FILE_TYPES: {
  value: FileExtension
  label: string
}[] = [
  { value: 'svg', label: 'SVG' },
  { value: 'png', label: 'PNG' }
]

async function downloadAllQRCodes () {
  try {
    const { default: QRCodeStyling } = await import('@likecoin/qr-code-styling')
    const qrCodeResults = await Promise.all(tableRows.value.map(async (link) => {
      const qrCode = new QRCodeStyling(getQRCodeOptions({ data: link.url }))
      const dataResults = await Promise.all(DOWNLOAD_QRCODE_FILE_TYPES.map(type => qrCode.getRawData(type.value)))
      const filename = getQRCodeFilename(link.channel)
      return DOWNLOAD_QRCODE_FILE_TYPES.map(({ value: ext }, index) => {
        const data = dataResults[index]
        if (!data) {
          throw new Error(`Failed to generate QR code for ${filename}.${ext}`)
        }
        return {
          filename: `${filename}.${ext}`,
          data
        }
      })
    }))

    const { default: JSZip } = await import('jszip')
    const zip = new JSZip().folder(productId.value)
    if (!zip) {
      throw new Error('Failed to create zip file')
    }
    qrCodeResults.flat().forEach((qrCode) => {
      zip.file(qrCode.filename, qrCode.data)
    })

    const { saveAs } = await import('file-saver')
    await zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${productName.value || productId.value}_qrcodes.zip`)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Failed to download QR codes',
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  }
}

onMounted(() => {
  if (productId.value) {
    nextTick(createAffiliationLink)
  }
})
</script>

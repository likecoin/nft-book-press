<template>
  <PageContainer>
    <PageHeader title="Generate Affiliation Links" />

    <PageBody class="flex flex-col items-stretch grow space-y-4">
      <UCard
        v-if="!productData && productData !== null"
        :ui="{ body: { base: 'space-y-4' }, footer: { base: 'flex justify-end' } }"
      >
        <UFormGroup label="Destination">
          <USelect v-model="destinationSetting" :options="destinationSettings" option-attribute="name" />
        </UFormGroup>

        <UFormGroup
          v-if="isUsingCustomDestination"
          label="Custom Page URL"
          :required="true"
        >
          <UInput
            v-model="customDestinationURLInput"
            class="font-mono"
            placeholder="https://books.liker.land"
            name="custom_destination_url"
          />
        </UFormGroup>

        <UFormGroup
          v-else
          label="Product ID/URL"
          :error="productIdError"
          :required="true"
        >
          <UInput
            v-model="productIdInputModel"
            class="font-mono"
            placeholder="https://liker.land/nft/class/likenft1ku4ra0e7dgknhd0wckrkxspuultynl4mgkxa3j08xeshfr2l0ujqmmvy83"
            name="product_id"
          />
        </UFormGroup>

        <UFormGroup
          label="Channel ID(s)"
          hint="Optional"
          :error="customChannelInputError"
        >
          <div class="flex gap-2">
            <UInput
              v-model="customChannelInput"
              class="grow font-mono"
              placeholder="Channel ID(s), separated by commas (e.g. @store01, @store02)"
              name="channel_ids"
            />
            <UButton
              v-show="!customChannelInput && userLikerInfo"
              class="relative"
              label="Prefill from Account"
              color="gray"
              variant="outline"
              size="2xs"
              @click="prefillChannelIdIfPossible"
            />
          </div>
        </UFormGroup>

        <UAccordion
          color="gray"
          variant="soft"
          size="md"
          :items="[{
            label: 'Query String (Optional)',
            defaultOpen: true,
            slot: 'body'
          }]"
          :ui="{ item: { padding: 'p-0' } }"
        >
          <template #body>
            <UCard :ui="{ body: { base: 'space-y-4' } }">
              <div class="relative flex max-md:flex-col flex-wrap gap-4">
                <UFormGroup class="flex-1" label="UTM Campaign">
                  <UInput
                    v-model="utmCampaignInput"
                    class="font-mono"
                    name="utm_campaign"
                    :placeholder="`e.g. ${utmCampaignDefault}`"
                  />
                </UFormGroup>
                <UFormGroup class="flex-1" label="UTM Source">
                  <UInput
                    v-model="utmSourceInput"
                    class="font-mono"
                    name="utm_source"
                    :placeholder="`e.g. ${utmSourceDefault}`"
                  />
                </UFormGroup>
                <UFormGroup class="flex-1" label="UTM Medium">
                  <UInput
                    v-model="utmMediumInput"
                    class="font-mono"
                    name="utm_medium"
                    :placeholder="`e.g. ${utmMediumDefault}`"
                  />
                </UFormGroup>
              </div>

              <UFormGroup label="Additional Query String">
                <UInput
                  v-model="additionalQueryStringInput"
                  class="font-mono"
                  :placeholder="additionalQueryStringInputPlaceholder"
                  name="query_params"
                />
              </UFormGroup>

              <div class="flex items-center gap-2">
                <UToggle v-model="shouldPrefixChannelIdForUTMCampaign" />
                <span v-text="'Prefix Channel ID for UTM Campaign'" />
              </div>
            </UCard>
          </template>
        </UAccordion>

        <template #footer>
          <UButton
            label="Generate"
            size="lg"
            :disabled="!canCreateAffiliationLink"
            :loading="isCreatingAffiliationLinks"
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
          v-if="commonQueryStringTableRows.length"
          class="px-4 py-5 sm:p-6"
        >
          <UCard
            :ui="{ body: { padding: '' } }"
          >
            <template #header>
              <h3
                class="text-sm font-bold"
                v-text="'Common Link Query Parameters'"
              />
            </template>

            <UTable
              :columns="[
                { key: 'key', label: 'Key' },
                { key: 'value', label: 'Value' }
              ]"
              :rows="commonQueryStringTableRows"
              :ui="{ td: { font: 'font-mono' } }"
            />
          </UCard>
        </div>

        <UTable :columns="linkTableColumns" :rows="linkTableRows">
          <template #channelId-data="{ row }">
            <div v-text="row.channelName" />
            <div
              class="text-gray-400 dark:text-gray-700 text-xs font-mono"
              v-text="row.channelId"
            />
          </template>
          <template #utmCampaign-data="{ row }">
            <UKbd class="font-mono" :value="row.utmCampaign" />
          </template>
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
          :data="selectedPurchaseLink.qrCodeUrl"
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
import { storeToRefs } from 'pinia'

import { AFFILIATION_CHANNEL_DEFAULT, AFFILIATION_CHANNELS } from '~/constant'

import { useCollectionStore } from '~/stores/collection'
import { useLikerStore } from '~/stores/liker'
import { useStripeStore } from '~/stores/stripe'
import { useUserStore } from '~/stores/user'

import { getPurchaseLink } from '~/utils'

const { LIKE_CO_API } = useRuntimeConfig().public
const collectionStore = useCollectionStore()
const likerStore = useLikerStore()
const stripeStore = useStripeStore()
const userStore = useUserStore()
const { userLikerInfo } = storeToRefs(userStore)
const route = useRoute()
const router = useRouter()
const toast = useToast()

const productIdInputModelValue = ref('')
const productIdInputModel = computed<string>({
  get: () => {
    if (productIdInputModelValue.value) {
      return productIdInputModelValue.value
    }
    const productIdQs = route.query.product_id
    if (productIdQs) {
      if (Array.isArray(productIdQs)) {
        return productIdQs.join(',')
      }
      return productIdQs
    }
    return ''
  },
  set: (value: string) => {
    productIdInputModelValue.value = value
  }
})

const productIdInputs = computed(() => {
  return productIdInputModel.value.split(',')
    .map(input => input.trim())
    .filter(Boolean)
})
const productIdInput = computed(() => {
  return productIdInputs.value[0] || ''
})

const productIds = computed(() => {
  return productIdInputs.value.map((input) => {
    if (input.startsWith('http')) {
      const url = new URL(input)
      const id = url.pathname.split('/').pop()
      if (id?.startsWith('col_') || id?.startsWith('likenft')) {
        return id
      }
    }
    return input
  })
})
const productId = computed(() => {
  return productIds.value[0] || ''
})

function constructUTMQueryString (input: {
  utmCampaign?: string,
  utmSource?: string,
  utmMedium?: string
} = {}) {
  const searchParams = new URLSearchParams()
  if (input.utmCampaign) {
    searchParams.set('utm_campaign', input.utmCampaign)
  }
  if (input.utmSource) {
    searchParams.set('utm_source', input.utmSource)
  }
  if (input.utmMedium) {
    searchParams.set('utm_medium', input.utmMedium)
  }
  return searchParams.toString().replace('?', '')
}

const utmCampaignInput = ref('')
const utmCampaignDefault = 'bookpress'
const shouldPrefixChannelIdForUTMCampaign = ref(true)

const utmMediumInput = ref('')
const utmMediumDefault = 'affiliate'

const utmSourceInput = ref('')
const utmSourceDefault = computed(() => {
  const isUseLikerLandLink = destinationSetting.value === 'liker_land'
  if (isUsingCustomDestination.value) {
    return 'custom-link'
  }
  return isUseLikerLandLink ? 'likerland' : 'stripe'
})

const linkQueryInputModel = ref('')
const additionalQueryStringInput = computed({
  get: () => {
    if (linkQueryInputModel.value) {
      return linkQueryInputModel.value
    }
    return constructUTMQueryString({
      utmCampaign: utmCampaignInput.value,
      utmSource: utmSourceInput.value,
      utmMedium: utmMediumInput.value
    })
  },
  set: (value) => {
    linkQueryInputModel.value = value
  }
})

const additionalQueryStringInputPlaceholder = computed(() => {
  return constructUTMQueryString({
    utmCampaign: utmCampaignDefault,
    utmSource: utmSourceDefault.value,
    utmMedium: utmMediumDefault
  })
})

const linkQueryDefault = computed(() => {
  return {
    utm_medium: utmMediumDefault,
    utm_source: utmSourceDefault.value,
    utm_campaign: utmCampaignDefault
  }
})
const mergedQueryStringObject = computed<Record<string, string>>(() => {
  const mergedObject = { ...linkQueryDefault.value }

  const input = productIdInput.value?.trim() || ''
  if (input.startsWith('http')) {
    Object.assign(mergedObject, Object.fromEntries(new URL(input).searchParams))
  }

  if (additionalQueryStringInput.value) {
    Object.assign(mergedObject, Object.fromEntries(new URLSearchParams(additionalQueryStringInput.value)))
  }

  return mergedObject
})
const commonQueryStringTableRows = computed(() => {
  return Object.entries(mergedQueryStringObject.value)
    .filter(([key]) => !(key === 'utm_campaign' && shouldPrefixChannelIdForUTMCampaign.value))
    .map(([key, value]) => ({
      key,
      value
    }))
})

const isCollection = computed(() => productId.value?.startsWith('col_'))

const destinationSettings = ref([
  {
    name: 'Liker Land Product Page',
    value: 'liker_land'
  },
  {
    name: 'Stripe Checkout Page',
    value: 'direct'
  },
  {
    name: 'Custom Page',
    value: 'custom'
  }
])
const destinationSetting = ref(destinationSettings.value[0].value)
const isUsingCustomDestination = computed(() => destinationSetting.value === 'custom')
const customDestinationURLInput = ref(route.query.custom_link as string || '')

const customChannelInput = ref('')
const customChannels = computed(
  () => customChannelInput.value
    .split(',')
    .map(channelId => channelId.trim())
    .filter(Boolean)
    .map((channelId) => {
      const channelInfo = likerStore.getChannelInfoById(channelId)
      return {
        id: channelId,
        name: channelInfo?.displayName || channelId
      }
    })
)

const productIdError = ref('')
watch(productId, () => {
  productIdError.value = ''
})
const customChannelInputError = ref('')
watch(customChannelInput, () => {
  customChannelInputError.value = ''
})

const isCreatingAffiliationLinks = ref(false)
const canCreateAffiliationLink = computed(() => {
  if (isUsingCustomDestination.value) {
    return !!customDestinationURLInput.value
  }
  return !!productId.value && !isCreatingAffiliationLinks.value
})

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

const tableTitle = computed(() => `${productName.value ? `${productName.value} ` : ''}Affiliation Links`)
const linkTableColumns = [
  {
    key: 'channelId',
    label: 'Channel',
    sortable: true
  },
  {
    key: 'utmCampaign',
    label: 'UTM Campaign'
  },
  {
    key: 'link',
    label: 'Link',
    sortable: false
  }
]
const linkTableRows = computed(() => {
  const channels = [...customChannels.value, ...AFFILIATION_CHANNELS]
  return channels.map((channel) => {
    const utmCampaignInput = mergedQueryStringObject.value.utm_campaign
    let utmCampaign = utmCampaignInput || utmCampaignDefault
    if (shouldPrefixChannelIdForUTMCampaign.value && channel.id !== AFFILIATION_CHANNEL_DEFAULT) {
      utmCampaign = `${convertChannelIdToLikerId(channel.id)}_${utmCampaign}`
    }
    const urlConfig: any = {
      [isCollection.value ? 'collectionId' : 'classId']: productId.value || '',
      channel: channel.id,
      priceIndex: priceIndex.value,
      customLink: isUsingCustomDestination.value ? customDestinationURLInput.value : undefined,
      isUseLikerLandLink: destinationSetting.value === 'liker_land',
      query: {
        utm_campaign: utmCampaign,
        ...mergedQueryStringObject.value
      }
    }
    return {
      channelId: channel.id,
      channelName: channel.name,
      utmCampaign,
      url: getPurchaseLink(urlConfig),
      qrCodeUrl: getPurchaseLink({
        ...urlConfig,
        isForQRCode: mergedQueryStringObject.value.utm_source === linkQueryDefault.value.utm_source
      })
    }
  })
})

const selectedPurchaseLink = ref<{
  channel: string,
  url: string,
  qrCodeUrl: string
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
        productIdError.value = 'Cannot fetch class data.'
      } else {
        return classData.value
      }
    }
  } catch {
    productIdError.value = 'Cannot fetch product data.'
  }
  return undefined
}

async function createAffiliationLink () {
  productIdError.value = ''
  productData.value = undefined
  customChannelInputError.value = ''

  if (!canCreateAffiliationLink.value) {
    return
  }

  try {
    isCreatingAffiliationLinks.value = true

    // Validate custom channels
    if (customChannels.value.length) {
      const invalidChannel = customChannels.value.find(channel => !validateChannelId(channel.id))
      if (invalidChannel) {
        customChannelInputError.value = `Invalid channel "${invalidChannel.id}", please enter a valid channel ID starting with "@"`
        return
      }

      try {
        await Promise.all(customChannels.value.map(async (channel) => {
          const channelInfo = await likerStore.lazyFetchChannelInfoById(channel.id)
          if (!channelInfo) {
            throw new Error(`Channel ID "${channel.id}" has not registered for Liker ID`)
          }

          const stripeConnectStatus = await stripeStore.fetchStripeConnectStatusByWallet(channelInfo.likeWallet)
          if (!stripeConnectStatus?.hasAccount) {
            throw new Error(`Channel ID "${channel.id}" has not connected to Stripe`)
          }
          if (!stripeConnectStatus?.isReady) {
            throw new Error(`Channel ID "${channel.id}" has not completed Stripe Connect setup`)
          }
        }))
      } catch (error) {
        customChannelInputError.value = (error as Error).message
        return
      }
    }

    if (productId.value) {
      const data = await fetchProductData()
      if (data) {
        productData.value = data
      }
    } else {
      productData.value = null
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Failed to create affiliation link',
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  } finally {
    isCreatingAffiliationLinks.value = false
  }
}

function getQRCodeFilename (channel = '') {
  const filenameParts: string[] = []
  if (isUsingCustomDestination.value) {
    const url = new URL(customDestinationURLInput.value)
    filenameParts.push(url.hostname)
  } else if (isCollection.value) {
    filenameParts.push(`price_${priceIndex.value}`)
  } else {
    filenameParts.push(`${productName.value || productId.value}`)
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
    data: linkTableRows.value,
    fileName: `${productName.value}_purchase_links.csv`,
    fileType: 'csv'
  })
}

function printAllQRCodes () {
  try {
    sessionStorage.setItem(
      'nft_book_press_batch_qrcode',
      convertArrayOfObjectsToCSV(linkTableRows.value.map(({ channelId, qrCodeUrl, ...link }) => ({ key: channelId, ...link, url: qrCodeUrl })))
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
      convertArrayOfObjectsToCSV(linkTableRows.value.map(({ channelId, ...link }) => ({ key: channelId, ...link })))
    )
    router.push({ name: 'batch-short-links', query: { print: 1 } })
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

async function downloadAllQRCodes () {
  const items = linkTableRows.value.map(link => ({
    url: link.qrCodeUrl,
    filename: getQRCodeFilename(link.channelId)
  }))
  await downloadQRCodes(items, {
    zipFilename: `${productName.value || productId.value}_QR Codes`
  })
}

function prefillChannelIdIfPossible () {
  if (!customChannelInput.value && userLikerInfo.value) {
    customChannelInput.value = convertLikerIdToChannelId(userLikerInfo.value.user)
  }
}

onMounted(() => {
  if (productId.value) {
    nextTick(createAffiliationLink)
  }

  prefillChannelIdIfPossible()
})

watch(userLikerInfo, () => {
  if (userLikerInfo.value) {
    prefillChannelIdIfPossible()
  }
})
</script>

<template>
  <PageContainer>
    <PageHeader :title="pageTitle" />

    <PageBody class="flex flex-col items-stretch grow space-y-4">
      <div
        v-if="(!productDataList && isSharingMode) || isCreatingAffiliationLinks"
        class="flex flex-col items-center justify-center self-stretch gap-4 py-10"
      >
        <UIcon
          class="w-10 h-10 animate-spin"
          name="i-heroicons-arrow-path-20-solid"
        />
        <span
          class="text-gray-400 dark:text-gray-700 text-sm"
          v-text="creatingAffiliationLinkState || 'Creating affiliation links...'"
        />
      </div>

      <UCard
        v-else-if="!productDataList"
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
            placeholder="https://liker.land/store?tag=blockchain"
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
            @click="createAffiliationLink"
          />
        </template>
      </UCard>

      <template v-else>
        <header v-if="!isSharingMode">
          <UButton
            icon="i-heroicons-arrow-uturn-left"
            label="Back to configuration"
            variant="soft"
            @click="productDataList = undefined"
          />
        </header>

        <UCard v-if="productTableRows.length" :ui="{ body: { padding: '' } }">
          <template #header>
            <h3 class="text-lg font-bold" v-text="'Product List'" />
          </template>

          <UTable
            :columns="[
              { key: 'name', label: 'Name' },
              { key: 'editionSelect', label: 'Selected Edition' }
            ]"
            :rows="productTableRows"
          >
            <template #name-data="{ row }">
              <div class="font-bold" v-text="row.name" />
            </template>
            <template #editionSelect-data="{ row }">
              <USelect
                v-if="row.editionOptions.length"
                class="min-w-[200px]"
                :model-value="productEditionSelectModelValue[row.id] || 0"
                :options="row.editionOptions"
                @update:model-value="productEditionSelectModelValue[row.id] = $event"
              />
            </template>
          </UTable>
        </UCard>

        <UCard
          v-if="channelTableRows.length"
          :ui="{
            body: { base: 'divide-y divide-gray-200 dark:divide-gray-800', padding: '' },
            footer: { base: 'flex justify-end' }
          }"
        >
          <template #header>
            <h3
              class="text-lg font-bold"
              v-text="`Channel${channelTableRows.length > 1 ? 's' : ''}`"
            />
          </template>

          <div
            v-if="customChannels.length > channelTablePageSize"
            class="flex justify-between items-center px-4 py-3"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-sm leading-5">Page size</span>

              <USelect
                v-model="channelTablePageSize"
                :options="[5, 10, 20]"
                class="w-20"
                size="xs"
              />
            </div>

            <UPagination
              v-model="channelTablePageNumber"
              :page-count="channelTablePageSize"
              :total="customChannels.length"
            />
          </div>

          <UTable
            :columns="channelTableColumns"
            :rows="channelTableRows"
          >
            <template #id-data="{ row }">
              <div
                class="text-gray-400 dark:text-gray-700 text-xs font-mono"
                v-text="row.id"
              />
            </template>
          </UTable>
        </UCard>

        <UCard
          v-if="!isSharingMode && commonQueryStringTableRows.length"
          :ui="{ body: { padding: '' } }"
        >
          <template #header>
            <h3 class="text-lg font-bold" v-text="'Common Query String'" />
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

        <UCard
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { base: 'divide-y divide-gray-200 dark:divide-gray-800', padding: '' }
          }"
        >
          <template #header>
            <div class="flex items-center gap-4">
              <h2 class="font-bold" v-text="'Affiliation Links'" />
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

          <UTable
            :columns="linkTableColumns"
            :rows="linkTableRows"
          >
            <template #productId-data="{ row }">
              <div v-text="row.productName" />
            </template>
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
            :file-name="getQRCodeFilename(selectedPurchaseLink)"
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
      </template>
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

const { LIKE_CO_API } = useRuntimeConfig().public
const collectionStore = useCollectionStore()
const likerStore = useLikerStore()
const stripeStore = useStripeStore()
const userStore = useUserStore()
const { userLikerInfo } = storeToRefs(userStore)
const route = useRoute()
const router = useRouter()
const toast = useToast()

const isSharingMode = computed({
  get: () => route.query.share === '1',
  set: (value) => {
    router.replace({
      query: {
        ...route.query,
        share: value ? '1' : undefined
      }
    })
  }
})

const pageTitle = computed(() => {
  return isSharingMode.value ? 'Affiliation Links' : 'Affiliation Link Generator'
})

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

const customChannelInputValue = ref('')
const customChannelInput = computed<string>({
  get: () => {
    if (customChannelInputValue.value) {
      return customChannelInputValue.value
    }
    const channelIdQs = route.query.from
    if (channelIdQs) {
      if (Array.isArray(channelIdQs)) {
        return channelIdQs.join(',')
      }
      return channelIdQs
    }
    return ''
  },
  set: (value: string) => {
    customChannelInputValue.value = value
  }
})
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

const channelTablePageSize = ref(5)
const channelTablePageNumber = ref(1)
const channelTableRows = computed(() => {
  const size = channelTablePageSize.value
  const pageNumber = channelTablePageNumber.value
  return customChannels.value.slice((pageNumber - 1) * size, (pageNumber) * size)
})
const channelTableColumns = computed(() => {
  return [
    {
      key: 'id',
      label: 'ID',
      sortable: channelTableRows.value.length > 1
    },
    {
      key: 'name',
      label: 'Channel'
    }
  ]
})

const productIdError = ref('')
watch(productId, () => {
  productIdError.value = ''
})
const customChannelInputError = ref('')
watch(customChannelInput, () => {
  customChannelInputError.value = ''
})

const creatingAffiliationLinkState = ref('')
const isCreatingAffiliationLinks = computed(() => !!creatingAffiliationLinkState.value)
const canCreateAffiliationLink = computed(() => {
  if (isUsingCustomDestination.value) {
    return !!customDestinationURLInput.value
  }
  return !!productId.value && !isCreatingAffiliationLinks.value
})

const productDataList = ref<{ id: string, data: any }[] | undefined>(undefined)

const productEditionOptionsMap = computed(() => {
  const optionsMap: Record<string, { label: string, value: number }[]> = {}
  if (productDataList.value) {
    for (const { id, data } of productDataList.value) {
      if (data.prices) {
        optionsMap[id] = data.prices.map((price: any) => ({
          label: `${price.name?.zh || price.name?.en || price.name} - $${price.price}`,
          value: price.index || 0
        }))
      } else {
        optionsMap[id] = []
      }
    }
  }
  return optionsMap
})
const productEditionSelectModelValue = ref<Record<string, number>>({})

const productTableRows = computed(() => {
  return productDataList.value?.map(({ id, data }) => ({
    id,
    name: data.name?.zh || data.name?.en || data.name,
    editionOptions: productEditionOptionsMap.value[id] || []
  })) || []
})

const linkTableColumns = computed(() => {
  const cols: { key: string, label: string, sortable?: boolean }[] = []
  if (!isUsingCustomDestination.value) {
    cols.push({
      key: 'productId',
      label: 'Product',
      sortable: true
    },
    {
      key: 'selectedEditionLabel',
      label: 'Edition'
    })
  }

  cols.push({
    key: 'channelId',
    label: 'Channel',
    sortable: true
  })

  if (!isSharingMode.value) {
    cols.push({
      key: 'utmCampaign',
      label: 'UTM Campaign',
      sortable: true
    })
  }
  cols.push({
    key: 'link',
    label: 'Link'
  })
  return cols
})

interface AffiliationLink {
  productId: string,
  productName: string,
  isCollection: boolean,
  selectedEditionLabel: string,
  selectedEditionIndex: number,
  channelId: string,
  channelName: string,
  utmCampaign: string,
  utmMedium: string,
  utmSource: string,
  url: string,
  qrCodeUrl: string,
}

const linkTableRows = computed(() => {
  const rows: AffiliationLink[] = []
  const channels = [...new Map([...customChannels.value, ...AFFILIATION_CHANNELS].map(c => [c.id, c])).values()]

  const items = isUsingCustomDestination.value
    ? [{ id: 'custom', data: { name: 'Custom' } }]
    : productDataList.value || []

  items.forEach(({ id, data }) => {
    const isCollection = id.startsWith('col_')

    channels.forEach((channel) => {
      const utmCampaignInput = mergedQueryStringObject.value.utm_campaign
      let utmCampaign = utmCampaignInput || linkQueryDefault.value.utm_campaign || ''
      if (shouldPrefixChannelIdForUTMCampaign.value && channel.id !== AFFILIATION_CHANNEL_DEFAULT) {
        utmCampaign = `${convertChannelIdToLikerId(channel.id)}_${utmCampaign}`
      }

      const priceIndex = productEditionSelectModelValue.value[id] || 0
      const urlConfig: any = {
        [isCollection ? 'collectionId' : 'classId']: id || '',
        channel: channel.id,
        priceIndex,
        customLink: isUsingCustomDestination.value ? customDestinationURLInput.value : undefined,
        isUseLikerLandLink: destinationSetting.value === 'liker_land',
        query: {
          utm_campaign: utmCampaign,
          ...mergedQueryStringObject.value
        }
      }

      rows.push({
        productId: id,
        productName: data.name?.zh || data.name?.en || data.name,
        isCollection,
        selectedEditionIndex: priceIndex,
        selectedEditionLabel: productEditionOptionsMap.value?.[id]?.[priceIndex]?.label || '',
        channelId: channel.id,
        channelName: channel.name,
        utmCampaign,
        utmMedium: mergedQueryStringObject.value.utm_medium,
        utmSource: mergedQueryStringObject.value.utm_source,
        url: getPurchaseLink(urlConfig),
        qrCodeUrl: getPurchaseLink({
          ...urlConfig,
          isForQRCode: mergedQueryStringObject.value.utm_source === linkQueryDefault.value.utm_source
        })
      })
    })
  })

  return rows
})

const selectedPurchaseLink = ref<AffiliationLink | undefined>(undefined)
const isOpenQRCodeModal = computed({
  get: () => !!selectedPurchaseLink.value,
  set: (value) => {
    if (!value) {
      selectedPurchaseLink.value = undefined
    }
  }
})

async function fetchProductData (id: string) {
  if (id.startsWith('col_')) {
    const data = await collectionStore.fetchCollectionById(id)
    if (!data) {
      throw new Error('Cannot fetch collection data.')
    }
    return {
      id,
      data
    }
  } else {
    const { data: classData, error: classFetchError } = await useFetch<any>(`${LIKE_CO_API}/likernft/book/store/${id}`)
    if (classFetchError.value) {
      throw new Error('Cannot fetch class data.')
    }
    return {
      id,
      data: classData.value
    }
  }
}

async function createAffiliationLink () {
  productIdError.value = ''
  productDataList.value = undefined
  productEditionSelectModelValue.value = {}
  customChannelInputError.value = ''
  creatingAffiliationLinkState.value = ''

  if (!canCreateAffiliationLink.value) {
    return
  }

  try {
    // Validate custom channels
    if (customChannels.value.length) {
      creatingAffiliationLinkState.value = 'Validating custom channels...'
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
        isSharingMode.value = false
        return
      }
    }

    creatingAffiliationLinkState.value = 'Fetching product data...'
    try {
      const dataList = await Promise.all(productIds.value.map(id => fetchProductData(id)))
      productDataList.value = dataList
    } catch (error) {
      productIdError.value = (error as Error).message
      isSharingMode.value = false
      return
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
    isSharingMode.value = false
  } finally {
    creatingAffiliationLinkState.value = ''
  }
}

function getQRCodeFilename (link: AffiliationLink) {
  const filenameParts: string[] = []
  if (isUsingCustomDestination.value) {
    const url = new URL(customDestinationURLInput.value)
    filenameParts.push(url.hostname)
  } else {
    filenameParts.push(`${link.productName || link.productId}`)

    if (link.isCollection) {
      filenameParts.push(`edition-${link.selectedEditionIndex}`)
    }
  }
  if (link.channelId) {
    filenameParts.push(`channel-${link.channelId}`)
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
    data: linkTableRows.value.map(({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isCollection,
      selectedEditionIndex,
      selectedEditionLabel, ...link
    }) => ({
      edition: `${selectedEditionIndex + 1}. ${selectedEditionLabel}`,
      ...link
    })),
    fileName: `affiliation_links_${Date.now()}.csv`,
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
    filename: getQRCodeFilename(link)
  }))
  await downloadQRCodes(items, {
    zipFilename: `affiliation_links_qrcodes_${Date.now()}`
  })
}

function prefillChannelIdIfPossible () {
  if (!customChannelInput.value && userLikerInfo.value) {
    customChannelInput.value = convertLikerIdToChannelId(userLikerInfo.value.user)
  }
}

onMounted(() => {
  if (isSharingMode.value) {
    nextTick(() => {
      createAffiliationLink()
    })
  }

  prefillChannelIdIfPossible()
})

watch(isSharingMode, (value) => {
  if (value) {
    createAffiliationLink()
  } else {
    productDataList.value = undefined
  }
})

watch(userLikerInfo, () => {
  if (userLikerInfo.value) {
    prefillChannelIdIfPossible()
  }
})
</script>

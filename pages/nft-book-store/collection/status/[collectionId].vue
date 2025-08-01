<template>
  <PageBody class="space-y-10 pb-10">
    <h1 class="text-lg font-bold font-mono">
      {{ $t('collection.nft_collection_status') }} "{{ collectionName }}"
    </h1>

    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />

    <UProgress v-if="isLoading" animation="carousel">
      <template #indicator>
        {{ $t('common.loading') }}
      </template>
    </UProgress>

    <template v-if="bookstoreApiStore.isAuthenticated">
      <UCard :ui="{ body: { padding: '' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            {{ $t('table.status') }}
          </h3>
        </template>

        <UTable
          :columns="[
            { key: 'pendingAction', label: $t('table.pending_action') },
            { key: 'sold', label: $t('table.sold') },
            { key: 'stock', label: $t('table.stock') },
          ]"
          :rows="[
            {
              pendingAction: collectionListingInfo.pendingNFTCount || 0,
              sold: collectionListingInfo.sold || 0,
              stock: collectionListingInfo.stock || 0
            },
          ]"
        >
          <template #pendingAction-data="{ row }">
            <UBadge
              v-if="row.pendingAction"
              :label="`${row.pendingAction}`"
              color="red"
              :ui="{ rounded: 'rounded-full' }"
            />
            <template v-else>
              {{ row.pendingAction }}
            </template>
          </template>
        </UTable>
      </UCard>

      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center gap-4' },
          body: { padding: '' },
        }"
      >
        <template #header>
          <h3 class="font-bold font-mono">
            {{ $t('pages.orders') }}
          </h3>

          <UInput v-model="searchInput" icon="i-heroicons-magnifying-glass-20-solid" :placeholder="$t('status_page.search_placeholder')" />
        </template>

        <UTable
          :columns="orderTableColumns"
          :rows="ordersTableRows"
        >
          <template #buyerEmail-data="{ row }">
            <UButton
              :label="row.buyerEmail"
              :to="`mailto:${row.buyerEmail}`"
              variant="link"
              :padded="false"
            />
          </template>
          <template #readerEmail-data="{ row }">
            <UButton
              :label="row.readerEmail"
              :to="`mailto:${row.readerEmail}`"
              variant="link"
              :padded="false"
            />
          </template>
          <template #wallet-data="{ row }">
            <UTooltip :text="row.wallet">
              <UButton
                class="font-mono"
                :label="row.shortenWallet"
                :to="row.walletLink"
                variant="link"
                :padded="false"
                size="xs"
                target="_blank"
              />
            </UTooltip>
          </template>
          <template #status-data="{ row }">
            <UBadge
              :color="row.statusLabelColor"
              :label="row.statusLabel"
              variant="outline"
              :ui="{ rounded: 'rounded-full' }"
            />
          </template>
          <template #actions-data="{ row }">
            <UDropdown :items="row.actions">
              <UButton
                :class="{ hidden: !row.actions.length }"
                icon="i-heroicons-ellipsis-horizontal-20-solid"
                color="gray"
                variant="ghost"
              />
            </UDropdown>
          </template>
        </UTable>
      </UCard>

      <UCard :ui="{ body: { padding: '' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            {{ $t('form.books_in_collection') }}
          </h3>
        </template>
        <UFormGroup>
          <UTable
            :columns="[
              { key: 'index',label:'' },
              { key: 'books', label: $t('collection.book_name') },
              { key: 'price', label: $t('table.price_usd') },
              { key: 'action', label: $t('common.edit') },
            ]"
            :rows="booksTableRow"
          >
            <template #books-data="{row}">
              <div
                class="flex flex-col gap-[8px] items-start"
              >
                <span
                  v-for="classId of row?.books"
                  :key="classId"
                  class="text-left whitespace-pre-line"
                >{{ `${getClassMetadataById(classId)?.name}\n class id: ${classId} \n` }}</span>
              </div>
            </template>
            <template #price-data="{ row }">
              <span class="text-center">{{ row.price }}</span>
            </template>
            <template #action-data="{ row }">
              <UButton
                icon="i-heroicons-document-magnifying-glass"
                :to="localeRoute({
                  name: 'nft-book-store-collection-status-collectionId-edit',
                  params: { collectionId:row.collectionId }
                })"
                variant="soft"
                color="gray"
              />
            </template>
          </UTable>
        </UFormGroup>
      </UCard>

      <StripeConnectCard
        v-if="userIsOwner"
        v-model:is-stripe-connect-checked="isStripeConnectChecked"
        v-model:is-using-default-account="isUsingDefaultAccount"
        :stripe-connect-wallet="stripeConnectWallet"
        :should-disable-setting="shouldDisableStripeConnectSetting"
        :login-address="wallet"

        @save="handleSaveStripeConnectWallet"
      />

      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { padding: '' }
        }"
      >
        <template #header>
          <h4 class="text-sm font-bold font-mono">
            {{ $t('form.email_notifications') }}
          </h4>

          <div class="flex gap-2">
            <UInput
              v-model="notificationEmailInput"
              placeholder="abc@example.com"
            />

            <UButton
              label="Add"
              :variant="notificationEmailInput ? 'outline' : 'solid'"
              :color="notificationEmailInput ? 'primary' : 'gray'"
              :disabled="!notificationEmailInput"
              @click="addNotificationEmail"
            />
          </div>
        </template>

        <UTable
          :columns="[{ key: 'email', label: $t('common.email'), sortable: true }, { key: 'action' }]"
          :rows="notificationEmailsTableRows"
        >
          <template #email-data="{ row }">
            <UButton
              :label="row.email"
              :to="`mailto:${row.email}`"
              variant="link"
              :padded="false"
            />
          </template>

          <template #action-data="{ row }">
            <div class="flex justify-end items-center">
              <UButton
                icon="i-heroicons-x-mark"
                variant="soft"
                color="red"
                @click="() => notificationEmails.splice(row.index, 1)"
              />
            </div>
          </template>
        </UTable>
      </UCard>

      <UCard :ui="{ body: { padding: '' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            Sales Channel Summary / 銷售渠道摘要
          </h3>
        </template>

        <UTable
          :columns="[
            { key: 'id', label: $t('table.channel_id'), sortable: true },
            { key: 'count', label: $t('table.count'), sortable: true },
            { key: 'totalUSD', label: $t('table.total_usd'), sortable: true },
          ]"
          :rows="salesChannelTableRows"
        >
          <template #id-data="{ row }">
            <span
              v-if="row.id !== 'empty'"
              class="font-bold font-mono"
            >{{ row.idLabel }}</span>
            <UBadge
              v-else
              :label="row.idLabel"
              :ui="{ rounded: 'rounded-full' }"
              color="gray"
            />
          </template>
        </UTable>
      </UCard>

      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { padding: '12px' },
        }"
      >
        <div class="flex justify-between items-center w-full">
          <h3 class="font-bold font-mono">
            {{ $t('nft_book_form.advanced_settings') }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            :icon="
              shouldShowAdvanceSettings
                ? 'i-heroicons-chevron-up'
                : 'i-heroicons-chevron-down'
            "
            @click="
              () => {
                shouldShowAdvanceSettings = !shouldShowAdvanceSettings;
              }
            "
          />
        </div>
        <template v-if="shouldShowAdvanceSettings">
          <div class="mt-[24px] flex flex-col gap-[12px]">
            <!-- Shipping Rates -->
            <ShippingRatesRateTable
              :is-show-physical-goods-checkbox="false"
              :is-loading="isUpdatingShippingRates"
              :shipping-info="collectionListingInfo.shippingRates"
              @update-shipping-rates="updateShippingRates"
            />

            <!-- Share sales data -->
            <UCard
              :ui="{
                header: { base: 'flex justify-between items-center' },
                body: { padding: '', base: 'space-y-8' }
              }"
            >
              <template #header>
                <h4 class="text-sm font-bold font-mono">
                  {{ $t('form.share_sales_data') }} / 分享銷售數據給特定地址
                </h4>
                <div class="flex gap-2">
                  <UInput
                    v-model="moderatorWalletInput"
                    class="font-mono"
                    placeholder="like1..."
                  />

                  <UButton
                    :label="$t('common.add')"
                    :variant="moderatorWalletInput ? 'outline' : 'solid'"
                    :color="moderatorWalletInput ? 'primary' : 'gray'"
                    :disabled="!moderatorWalletInput"
                    @click="addModeratorWallet"
                  />
                </div>
              </template>

              <UTable
                :columns="moderatorWalletsTableColumns"
                :rows="moderatorWalletsTableRows"
              >
                <template #wallet-data="{ row }">
                  <UTooltip :text="row.wallet">
                    <UButton
                      class="font-mono"
                      :label="row.shortenWallet"
                      :to="row.walletLink"
                      variant="link"
                      :padded="false"
                      size="xs"
                    />
                  </UTooltip>
                </template>
                <template #remove-data="{ row }">
                  <div class="flex justify-end items-center">
                    <UButton
                      icon="i-heroicons-x-mark"
                      variant="soft"
                      color="red"
                      @click="() => moderatorWallets.splice(row.index, 1)"
                    />
                  </div>
                </template>
              </UTable>
            </UCard>

            <!-- Copy Purchase Link -->
            <UCard
              :ui="{ body: { base: 'space-y-4' } }"
            >
              <template #header>
                <h3 class="font-bold font-mono">
                  {{ $t('form.copy_purchase_link') }}
                </h3>
              </template>

              <div>
                <UToggle v-model="useLikerLandPurchaseLink" />
                Use {{ useLikerLandPurchaseLink ? 'Liker Land' : 'Stripe' }} Purchase Link
              </div>

              <UFormGroup :label="$t('form.sales_channel_for_links')" :hint="$t('common.optional')">
                <UInput v-model="fromChannel" placeholder="Channel ID" />
              </UFormGroup>

              <UButton
                class="font-mono break-all"
                :label="`${purchaseLink}`"
                :to="purchaseLink"
                variant="outline"
                color="gray"
                target="_blank"
              />
              <br>
              <UButton
                :label="$t('form.copy_purchase_link')"
                variant="outline"
                color="primary"
                @click="copyPurchaseLink"
              />

              <QRCode
                :data="purchaseLink"
                :file-name="`collection-${collectionName}-channel_${fromChannel || ''}`"
                :width="500"
                :height="500"
              >
                <template #header>
                  <h3 class="font-bold font-mono">
                    {{ $t('collection.purchase_link_qr') }}
                  </h3>
                </template>
              </QRCode>
            </UCard>
          </div>
        </template>
      </UCard>
      <UButton
        :label="$t('common.save')"
        :loading="isLoading"
        size="lg"
        :disabled="isLoading"
        @click="updateSettings"
      />
    </template>

    <NuxtPage :transition="false" />
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'
import { useWalletStore } from '~/stores/wallet'
import { useStripeStore } from '~/stores/stripe'
import { getPortfolioURL, formatShippingAddress, getPurchaseLink } from '~/utils'
import { shortenWalletAddress } from '~/utils/cosmos'

const { CHAIN_EXPLORER_URL, LIKE_CO_API } = useRuntimeConfig().public
const store = useWalletStore()
const bookstoreApiStore = useBookstoreApiStore()
const nftStore = useNftStore()
const collectionStore = useCollectionStore()
const stripeStore = useStripeStore()
const { token } = storeToRefs(bookstoreApiStore)
const { wallet } = storeToRefs(store)
const { updateNFTBookCollectionById, reduceListingPendingNFTCountById } = collectionStore
const { getClassMetadataById, lazyFetchClassMetadataById } = nftStore
const { fetchStripeConnectStatusByWallet } = stripeStore

const route = useRoute()
const localeRoute = useLocaleRoute()
const toast = useToast()
const { t: $t } = useI18n()

const error = ref('')
const isLoading = ref(false)
const collectionId = ref(route.params.collectionId as string)
const fromChannel = ref<string | undefined>(undefined)
const collectionListingInfo = ref<any>({})
const ordersData = ref<any>({})
const isUpdatingShippingRates = ref(false)

// Search
const searchInput = ref('')

const moderatorWallets = ref<string[]>([])
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const connectedWallets = ref<any>({})
const useLikerLandPurchaseLink = ref(true)
const shouldShowAdvanceSettings = ref<boolean>(false)
const shouldDisableStripeConnectSetting = ref(false)
const isUsingDefaultAccount = ref(true)

const collectionName = computed(() => collectionStore.getCollectionById(collectionId.value as string)?.name)
const ownerWallet = computed(() => collectionListingInfo?.value?.ownerWallet)
const orderHasShipping = computed(() => purchaseList.value.find((p: any) => !!p.shippingStatus))
const userIsOwner = computed(() => wallet.value && ownerWallet.value === wallet.value)
const userCanSendNFT = computed(() => userIsOwner.value)
const purchaseLink = computed(() => getPurchaseLink({
  collectionId: collectionId.value as string,
  channel: fromChannel.value,
  isUseLikerLandLink: useLikerLandPurchaseLink.value
}))
const salesChannelMap = computed(() => {
  if (!purchaseList.value.length) {
    return {}
  }
  const map: {
    [key in string]: {
      count: number,
      totalUSD: number
    };
  } = purchaseList.value.reduce((acc: any, cur: any) => {
    const from = cur.from || 'empty'
    if (!acc[from]) {
      acc[from] = {
        count: 0,
        totalUSD: 0
      }
    }
    acc[from].count += 1
    acc[from].totalUSD += cur.price
    return acc
  }, {})
  return map
})

const purchaseList = computed(() => {
  if (ordersData.value?.orders) {
    return ordersData.value.orders.map((purchase: any) => {
      const timestamp = purchase.timestamp
      const date = new Date(timestamp)
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
      return { ...purchase, formattedDate }
    }).sort((a: any, b: any) => b.timestamp - a.timestamp)
  }
  return []
})

const orderTableColumns = computed(() => {
  const columns = [
    { key: 'actions', label: $t('table.actions'), sortable: false },
    { key: 'orderDate', label: $t('table.order_date'), sortable: true },
    { key: 'status', label: $t('table.status'), sortable: true }
  ]
  if (orderHasShipping.value) {
    columns.push({ key: 'shippingStatus', label: $t('table.shipping_status'), sortable: true })
  }
  columns.push(
    { key: 'from', label: $t('table.sales_channel'), sortable: true },
    { key: 'price', label: $t('form.price'), sortable: true },
    { key: 'quantity', label: $t('table.quantity'), sortable: true },
    { key: 'coupon', label: $t('table.coupon_applied'), sortable: false },
    { key: 'buyerEmail', label: $t('table.buyer_email'), sortable: true },
    { key: 'readerEmail', label: $t('table.reader_email'), sortable: true },
    { key: 'wallet', label: $t('table.reader_wallet'), sortable: true },
    { key: 'message', label: $t('table.reader_message'), sortable: false }
  )
  if (orderHasShipping.value) {
    columns.push({ key: 'buyerPhone', label: $t('table.buyer_phone'), sortable: true })
    columns.push({ key: 'shippingName', label: $t('table.shipping_name'), sortable: true })
    columns.push({ key: 'shippingAddress', label: $t('table.shipping_address'), sortable: true })
    columns.push({ key: 'shippingCountry', label: $t('table.shipping_country'), sortable: true })
  }

  return columns
})

function getOrdersTableActionItems (purchaseListItem: any) {
  const actionItems = []

  if (purchaseListItem.status === 'completed' && purchaseListItem.txHash) {
    actionItems.push([{
      label: $t('collection.view_transaction'),
      icon: 'i-heroicons-magnifying-glass',
      to: `${CHAIN_EXPLORER_URL}/${purchaseListItem.txHash}`,
      target: '_blank'
    }])
  } else if (purchaseListItem.status === 'pendingNFT' && userCanSendNFT.value) {
    actionItems.push([{
      label: 'Send NFT',
      icon: 'i-heroicons-paper-airplane',
      to: localeRoute({
        name: 'nft-book-store-collection-send-collectionId',
        params: {
          collectionId: purchaseListItem.collectionId
        },
        query: {
          owner_wallet: ownerWallet.value,
          payment_id: purchaseListItem.id
        }
      })
    }])
  }

  if (purchaseListItem.status === 'paid') {
    actionItems.push([{
      label: $t('collection.send_reminder_email'),
      icon: 'i-heroicons-envelope',
      click: () => {
        sendReminderEmail(purchaseListItem)
      }
    }])
  }

  if (['pendingNFT', 'paid'].includes(purchaseListItem.status)) {
    actionItems.push([{
      label: $t('collection.mark_complete'),
      icon: 'i-heroicons-check-circle',
      click: () => {
        hardSetStatusToCompleted(purchaseListItem)
      }
    }])
  }

  return actionItems
}

function getStatusLabel (purchaseListItem: any) {
  switch (purchaseListItem.status) {
    case 'paid':
      return 'Paid'

    case 'pendingNFT':
      return 'Pending NFT'

    case 'completed':
      if (purchaseListItem.shippingStatus === 'pending') {
        return $t('collection.pending_shipping')
      }
      return $t('status.completed')

    default:
      return purchaseListItem.status
  }
}

function getStatusLabelColor (purchaseListItem: any) {
  switch (purchaseListItem.status) {
    case 'paid':
      return 'blue'

    case 'pendingNFT':
      return 'amber'

    case 'completed':
      if (purchaseListItem.shippingStatus === 'pending') {
        return 'amber'
      }
      return 'green'

    default:
      return 'gray'
  }
}

const ordersTableRows = computed(() => purchaseList.value?.map((p: any, index: number) => ({
  index,
  buyerEmail: p.email,
  buyerPhone: p.phone || '',
  readerEmail: p.giftInfo?.toEmail || p.email,
  status: p.status,
  statusLabel: getStatusLabel(p),
  statusLabelColor: getStatusLabelColor(p),
  orderDate: p.formattedDate,
  shippingStatus: p.shippingStatus,
  shippingCountry: p.shippingDetails?.address?.country || '',
  shippingAddress: formatShippingAddress(p.shippingDetails) || '',
  shippingName: p.shippingDetails?.name || '',
  wallet: p.wallet || '',
  walletLink: getPortfolioURL(p.wallet),
  shortenWallet: shortenWalletAddress(p.wallet),
  priceName: p.priceName,
  price: p.price || 0,
  quantity: p.quantity || 1,
  coupon: p.coupon || '',
  message: p.message || '',
  from: p.from || '',
  actions: getOrdersTableActionItems(p)
})).filter((p: any) => {
  if (!searchInput.value) { return true }
  const normalizedSearchInput = searchInput.value.toLowerCase()
  return (
    p.buyerEmail.toLowerCase().includes(normalizedSearchInput) ||
    p.buyerPhone.toLowerCase().includes(normalizedSearchInput) ||
    p.readerEmail.toLowerCase().includes(normalizedSearchInput) ||
    p.wallet?.toLowerCase().includes(normalizedSearchInput) ||
    p.priceName?.toLowerCase().includes(normalizedSearchInput) ||
    p.statusLabel?.toLowerCase().includes(normalizedSearchInput) ||
    p.orderDate?.toLowerCase().includes(normalizedSearchInput) ||
    p.from?.toLowerCase().includes(normalizedSearchInput)
  )
}))

const moderatorWalletsTableColumns = computed(() => {
  const columns = [{ key: 'wallet', label: $t('table.wallet'), sortable: true }]

  if (userIsOwner.value) {
    columns.push(
      { key: 'remove', label: '', sortable: false }
    )
  }

  return columns
})

const moderatorWalletsTableRows = computed(() => moderatorWallets.value
  ? moderatorWallets.value.map((wallet, index) => {
    return {
      index,
      wallet,
      shortenWallet: shortenWalletAddress(wallet),
      walletLink: getPortfolioURL(wallet)
    }
  })
  : [])

const notificationEmailsTableRows = computed(() => notificationEmails.value?.map((email, index) => ({
  index,
  email
})))

const booksTableRow = computed(() => {
  const classId = collectionListingInfo.value?.classIds
  if (!classId?.length) {
    return []
  }
  return [
    {
      index: 1,
      books: collectionListingInfo.value?.classIds,
      price: collectionListingInfo.value?.priceInDecimal / 100,
      action: collectionId.value
    }
  ]
})

function normalizeChannelId (channelId: string) {
  switch (channelId) {
    case 'empty':
      return 'Not set'

    default:
      return channelId
  }
}

const salesChannelTableRows = computed(() => Object.entries(salesChannelMap.value)?.map(([id, value]) => ({
  id,
  idLabel: normalizeChannelId(id),
  count: value.count || 0,
  totalUSD: value.totalUSD || 0
})))

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

onMounted(async () => {
  isLoading.value = true
  try {
    collectionListingInfo.value = (await collectionStore.fetchCollectionById(collectionId.value as string))
    const typePayload = collectionListingInfo.value.typePayload
    if (typePayload) {
      collectionListingInfo.value = {
        ...collectionListingInfo.value,
        ...typePayload
      }
    }
    const {
      moderatorWallets: classModeratorWallets,
      notificationEmails: classNotificationEmails,
      connectedWallets: classConnectedWallets
    } = collectionListingInfo.value as any
    moderatorWallets.value = classModeratorWallets
    notificationEmails.value = classNotificationEmails
    isStripeConnectChecked.value = !!(classConnectedWallets && Object.keys(classConnectedWallets).length)
    connectedWallets.value = classConnectedWallets

    const classStripeWallet = classConnectedWallets && Object.keys(classConnectedWallets)[0]
    if (classStripeWallet) {
      stripeConnectWallet.value = classStripeWallet
      if (classStripeWallet !== wallet.value) {
        isUsingDefaultAccount.value = false
        try {
          await fetchStripeConnectStatusByWallet(classStripeWallet)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err)
        }
      }
    }
    const orders = await $fetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/orders`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })

    ordersData.value = orders

    if (wallet.value) {
      try {
        await fetchStripeConnectStatusByWallet(wallet.value)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    }
    collectionListingInfo.value.classIds.forEach((classId: string) => lazyFetchClassMetadataById(classId))
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
})

async function sendReminderEmail (purchase: any) {
  const orderData = ordersData.value?.orders?.find((p: any) => p.id === purchase.id)
  if (!orderData) {
    throw new Error('ORDER_NOT_FOUND')
  }

  await $fetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/status/${purchase.id}/remind`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })

  toast.add({
    icon: 'i-heroicons-check-circle',
    title: $t('collection.send_reminder_email'),
    timeout: 2000,
    color: 'green'
  })
}

async function hardSetStatusToCompleted (purchase: any) {
  const userConfirmed = confirm('Do you want to skip the \'Send NFT\' action and override this payment status to \'completed\'?')
  if (!userConfirmed) {
    return
  }

  const orderData = ordersData.value?.orders?.find((p: any) => p.id === purchase.id)
  if (!orderData) {
    throw new Error('ORDER_NOT_FOUND')
  }

  const previousStatus = orderData.status
  orderData.status = 'completed'

  try {
    await $fetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/sent/${purchase.id}`,
      {
        method: 'POST',
        body: {
          txHash: null,
          quantity: purchase.quantity || 1
        },
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
  } catch (err) {
    orderData.status = previousStatus
    throw err
  }

  if (previousStatus === 'pendingNFT') {
    collectionListingInfo.value.pendingNFTCount -= 11
    reduceListingPendingNFTCountById(collectionId.value, 1)
  }
}

function addModeratorWallet () {
  if (!moderatorWalletInput.value) { return }
  moderatorWallets.value.push(moderatorWalletInput.value)
  moderatorWalletInput.value = ''
}

function addNotificationEmail () {
  if (!notificationEmailInput.value) { return }
  notificationEmails.value.push(notificationEmailInput.value)
  notificationEmailInput.value = ''
}

async function handleSaveStripeConnectWallet (wallet: any) {
  connectedWallets.value = {
    [wallet]: 100
  }
  stripeConnectWallet.value = wallet
  try {
    await updateNFTBookCollectionById(collectionId.value as string, {
      connectedWallets: connectedWallets.value
    })
  } catch (err) {
    const errorData = (err as any).data || err
    error.value = errorData
  } finally {
    shouldDisableStripeConnectSetting.value = true
  }
}

async function updateSettings () {
  try {
    if (moderatorWalletInput.value) {
      throw new Error($t('errors.add_moderator_wallet'))
    }
    if (notificationEmailInput.value) {
      throw new Error($t('errors.add_notification_email'))
    }
    isLoading.value = true

    const newConnectedWallets = (isStripeConnectChecked.value && stripeConnectWallet.value)
      ? connectedWallets.value
      : null
    await updateNFTBookCollectionById(collectionId.value as string, {
      moderatorWallets,
      notificationEmails,
      connectedWallets: newConnectedWallets
    })
    await navigateTo(localeRoute({
      name: 'nft-book-store-collection'
    }))
  } catch (err) {
    const errorData = (err as any).data || err
    console.error(errorData)
    error.value = errorData
  } finally {
    isLoading.value = false
    shouldDisableStripeConnectSetting.value = false
  }
}

async function updateShippingRates (value: any) {
  isUpdatingShippingRates.value = true
  try {
    await updateNFTBookCollectionById(collectionId.value as string, {
      shippingRates: value
    })
    collectionListingInfo.value = (await collectionStore.fetchCollectionById(collectionId.value as string))
    const typePayload = collectionListingInfo.value.typePayload
    if (typePayload) {
      collectionListingInfo.value = {
        ...collectionListingInfo.value,
        ...typePayload
      }
    }
  } catch (err) {
    const errorData = (err as any).data || err
    error.value = errorData
  } finally {
    isUpdatingShippingRates.value = false
  }
}

async function copyPurchaseLink () {
  await navigator.clipboard.writeText(purchaseLink.value)
  toast.add({
    icon: 'i-heroicons-check-circle',
    title: $t('purchase_link.copied_to_clipboard'),
    timeout: 2000,
    color: 'green'
  })
}

</script>

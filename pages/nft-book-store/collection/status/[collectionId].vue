<template>
  <PageBody class="space-y-10 pb-10">
    <h1 class="text-lg font-bold font-mono">
      NFT Book Collection Status "{{ collectionName }}"
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
        Loading...
      </template>
    </UProgress>

    <template v-if="bookStoreApiStore.isAuthenticated">
      <UCard :ui="{ body: { padding: '' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            Status
          </h3>
        </template>

        <UTable
          :columns="[
            { key: 'pendingAction', label: 'Pending Action' },
            { key: 'sold', label: 'Sold' },
            { key: 'stock', label: 'Stock' },
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
            Orders
          </h3>

          <UInput v-model="searchInput" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
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
            Books in Collection
          </h3>
        </template>
        <UFormGroup>
          <UTable
            :columns="[
              { key: 'index',label:'' },
              { key: 'books', label: 'Books' },
              { key: 'price', label: 'Price (USD)' },
              { key: 'action', label: 'Edit' },
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
                :to="{
                  name: 'nft-book-store-collection-status-collectionId-edit',
                  params: { collectionId:row.collectionId }
                }"
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
            Email to receive sales notifications / 欲收到銷售通知的電郵
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
          :columns="[{ key: 'email', label: 'Email', sortable: true }, { key: 'action' }]"
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
            { key: 'id', label: 'Channel ID', sortable: true },
            { key: 'count', label: 'Count', sortable: true },
            { key: 'totalUSD', label: 'Total USD', sortable: true },
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
            Advanced Settings
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
                  Share sales data to wallets / 分享銷售數據給特定地址
                </h4>
                <div class="flex gap-2">
                  <UInput
                    v-model="moderatorWalletInput"
                    class="font-mono"
                    placeholder="like1..."
                  />

                  <UButton
                    label="Add"
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
                <template #authz-data="{ row }">
                  <UButton
                    :label="row.grantLabel"
                    :to="row.grantRoute"
                    :variant="row.isGranted ? 'outline' : 'solid'"
                    color="green"
                  />
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
                  Copy Purchase Link / 複製購買連結
                </h3>
              </template>

              <div>
                <UToggle v-model="useLikerLandPurchaseLink" />
                Use {{ useLikerLandPurchaseLink ? 'Liker Land' : 'Stripe' }} Purchase Link
              </div>

              <UFormGroup label="Sales channel for this link" hint="Optional">
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
                label="Copy Purchase Link"
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
                    Purchase Link QR Code
                  </h3>
                </template>
              </QRCode>
            </UCard>
          </div>
        </template>
      </UCard>
      <UButton
        label="Save Changes"
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
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'
import { useWalletStore } from '~/stores/wallet'
import { useStripeStore } from '~/stores/stripe'
import { getPortfolioURL, formatShippingAddress, getPurchaseLink } from '~/utils'
import { getNFTAuthzGrants, shortenWalletAddress } from '~/utils/cosmos'

const { CHAIN_EXPLORER_URL, LIKE_CO_API } = useRuntimeConfig().public
const store = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const nftStore = useNftStore()
const collectionStore = useCollectionStore()
const stripeStore = useStripeStore()
const { token } = storeToRefs(bookStoreApiStore)
const { wallet } = storeToRefs(store)
const { updateNFTBookCollectionById } = collectionStore
const { getClassMetadataById, lazyFetchClassMetadataById } = nftStore
const { fetchStripeConnectStatusByWallet } = stripeStore

const route = useRoute()
const router = useRouter()
const toast = useToast()

const error = ref('')
const isLoading = ref(false)
const collectionId = ref(route.params.collectionId)
const fromChannel = ref<string | undefined>(undefined)
const collectionListingInfo = ref<any>({})
const ordersData = ref<any>({})
const isUpdatingShippingRates = ref(false)

// Search
const searchInput = ref('')

const moderatorWallets = ref<string[]>([])
const moderatorWalletsGrants = ref<any>({})
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
const userCanSendNFT = computed(() => userIsOwner.value || (wallet.value && moderatorWalletsGrants.value[wallet.value]))
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
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'orderDate', label: 'Order Date', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ]
  if (orderHasShipping.value) {
    columns.push({ key: 'shippingStatus', label: 'Shipping Status', sortable: true })
  }
  columns.push(
    { key: 'from', label: 'Sales Channel', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'coupon', label: 'Coupon Applied', sortable: false },
    { key: 'buyerEmail', label: 'Buyer Email', sortable: true },
    { key: 'readerEmail', label: 'Reader Email', sortable: true },
    { key: 'wallet', label: 'Reader Wallet', sortable: true },
    { key: 'message', label: 'Reader Message', sortable: false }
  )
  if (orderHasShipping.value) {
    columns.push({ key: 'buyerPhone', label: 'Buyer Phone', sortable: true })
    columns.push({ key: 'shippingName', label: 'Shipping Name', sortable: true })
    columns.push({ key: 'shippingAddress', label: 'Shipping Address', sortable: true })
    columns.push({ key: 'shippingCountry', label: 'Shipping Country', sortable: true })
  }

  return columns
})

function getOrdersTableActionItems (purchaseListItem: any) {
  const actionItems = []

  if (purchaseListItem.status === 'completed' && purchaseListItem.txHash) {
    actionItems.push([{
      label: 'View Transaction',
      icon: 'i-heroicons-magnifying-glass',
      to: `${CHAIN_EXPLORER_URL}/${purchaseListItem.txHash}`,
      target: '_blank'
    }])
  } else if (purchaseListItem.status === 'pendingNFT' && userCanSendNFT.value) {
    actionItems.push([{
      label: 'Send NFT',
      icon: 'i-heroicons-paper-airplane',
      to: {
        name: 'nft-book-store-collection-send-collectionId',
        params: {
          collectionId: purchaseListItem.collectionId
        },
        query: {
          owner_wallet: ownerWallet.value,
          payment_id: purchaseListItem.id
        }
      }
    }])
  }

  if (purchaseListItem.status === 'paid') {
    actionItems.push([{
      label: 'Send Reminder Email',
      icon: 'i-heroicons-envelope',
      click: () => {
        sendReminderEmail(purchaseListItem)
      }
    }])
  }

  if (['pendingNFT', 'paid'].includes(purchaseListItem.status)) {
    actionItems.push([{
      label: 'Mark Complete',
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
      return 'Completed'

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
  const columns = [{ key: 'wallet', label: 'Wallet', sortable: true }]

  if (userIsOwner.value) {
    columns.push(
      { key: 'authz', label: 'Send NFT Grant', sortable: false },
      { key: 'remove', label: '', sortable: false }
    )
  }

  return columns
})

const moderatorWalletsTableRows = computed(() => moderatorWallets.value
  ? moderatorWallets.value.map((wallet, index) => {
    const isGranted = !!moderatorWalletsGrants.value[wallet]
    return {
      index,
      wallet,
      shortenWallet: shortenWalletAddress(wallet),
      walletLink: getPortfolioURL(wallet),
      isGranted,
      grantLabel: isGranted ? 'Granted' : 'Grant',
      grantRoute: {
        name: 'authz',
        query: {
          grantee: wallet
        }
      }
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

watch(moderatorWallets, (newModeratorWallets) => {
  newModeratorWallets?.forEach(async (m) => {
    if (!moderatorWalletsGrants.value[m]) {
      try {
        moderatorWalletsGrants.value[m] = await getNFTAuthzGrants(ownerWallet.value, m)
      } catch {}
    }
  })
})

onMounted(async () => {
  isLoading.value = true
  try {
    collectionListingInfo.value = (await collectionStore.fetchCollectionById(collectionId.value as string)).value
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
        await fetchStripeConnectStatusByWallet(classStripeWallet)
      }
    }
    const { data: orders, error: fetchOrdersError } = await useFetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/orders`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
    if (fetchOrdersError.value) {
      if (fetchOrdersError.value.statusCode === 403) {
        throw new Error('NOT_OWNER_OF_NFT_COLLECTION')
      } else {
        throw fetchOrdersError.value
      }
    }

    ordersData.value = orders.value

    await fetchStripeConnectStatusByWallet(wallet.value)
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

  const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/status/${purchase.id}/remind`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })

  if (fetchError.value) {
    throw fetchError.value
  }

  toast.add({
    icon: 'i-heroicons-check-circle',
    title: 'Reminder email sent',
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

  const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/collection/purchase/${collectionId.value}/sent/${purchase.id}`,
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
  if (fetchError.value) {
    orderData.status = previousStatus
    throw fetchError.value
  }
  collectionListingInfo.value.pendingNFTCount -= 1
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
      throw new Error('Please press "Add" button to add moderator wallet')
    }
    if (notificationEmailInput.value) {
      throw new Error('Please press "Add" button to add notification email')
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
    router.push({
      name: 'nft-book-store-collection'
    })
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
    collectionListingInfo.value = (await collectionStore.fetchCollectionById(collectionId.value as string)).value
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
    title: 'Copied purchase link to clipboard',
    timeout: 2000,
    color: 'green'
  })
}

</script>

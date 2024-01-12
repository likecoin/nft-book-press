<template>
  <main class="space-y-4">
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
        <UFormGroup label="Books in Collection">
          <UTable
            :columns="[{ key: 'classId', label: 'Class ID' }, { key: 'name', label: 'Book Name'}]"
            :rows="collectionListingInfo?.classIds?.map((classId, index) => ({ index, classId, name: getClassMetadataById(classId)?.name }))"
          />
        </UFormGroup>
        <table class="w-full divide-y text-sm">
          <thead class="border-b-2">
            <tr class="text-left">
              <th class="px-3 py-4 text-right">
                Price (USD)
              </th>
              <th class="px-3 py-4 text-right">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-3 py-4 text-right">
                {{ collectionListingInfo.priceInDecimal / 100 }}
              </td>
              <td class="text-center">
                <UButton
                  icon="i-heroicons-document-magnifying-glass"
                  :to="{
                    name: 'nft-book-store-collection-status-collectionId-edit',
                    params: { collectionId }
                  }"
                  variant="soft"
                  color="gray"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </UCard>

      <UCard
        v-if="collectionListingInfo.shippingRates"
        :ui="{ body: { padding: '' } }"
      >
        <template #header>
          <h3 class="font-bold font-mono">
            Shipping Options
          </h3>
        </template>

        <UTable
          :columns="[
            { key: 'index', },
            { key: 'name', label: 'Name' },
            { key: 'price', label: 'Price (USD)' },
          ]"
          :rows="shippingRatesTableRows"
        >
          <template #price-data="{ row }">
            <span class="text-right">{{ row.price }}</span>
          </template>
        </UTable>
      </UCard>

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
          <template #email-data="{ row }">
            <UButton
              :label="row.email"
              :to="`mailto:${row.email}`"
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

      <UCard
        v-if="userIsOwner"
        :ui="{
          divide: isStripeConnectChecked ? undefined : '',
          header: { base: 'flex flex-wrap justify-between items-center gap-2' },
          body: { padding: isStripeConnectChecked ? undefined : '', base: 'grid lg:grid-cols-2 gap-4' }
        }"
      >
        <template #header>
          <h3 class="font-bold font-mono">
            Connect to your own Stripe Account
          </h3>
          <UToggle v-model="isStripeConnectChecked" name="stripe" label="Use a Stripe Connect account for receiving all payment" />
        </template>

        <template v-if="isStripeConnectChecked">
          <URadio v-model="stripeConnectWallet" :disabled="!(connectStatus?.isReady)" :value="ownerWallet">
            <template #label>
              <span v-if="connectStatus?.isReady">Use my account</span>
              <span v-else>
                No stripe account connected yet.<br>
                <UButton
                  class="mt-2"
                  label="Create one here"
                  :to="{ name: 'nft-book-store-user' }"
                  target="_blank"
                  variant="outline"
                />
              </span>
            </template>
          </URadio>
          <URadio v-model="stripeConnectWallet" :value="stripeConnectWalletInput">
            <template #label>
              <UFormGroup label="Enter a wallet address with connected account">
                <UInput
                  v-if="stripeConnectWallet !== ownerWallet"
                  v-model="stripeConnectWalletInput"
                  class="font-mono"
                  placeholder="like1..."
                  @input="onStripeConnectWalletInput"
                />
              </UFormGroup>
            </template>
          </URadio>
        </template>
      </UCard>

      <UCard :ui="{ body: { base: 'space-y-8' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            Other Settings
          </h3>
        </template>

        <UCard
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { padding: '', base: 'space-y-8' }
          }"
        >
          <template #header>
            <h4 class="text-sm font-bold font-mono">
              Share sales data to wallets
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

        <UCard
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { padding: '' }
          }"
        >
          <template #header>
            <h4 class="text-sm font-bold font-mono">
              Email to receive sales notifications
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

        <template #footer>
          <UButton
            label="Update"
            @click="updateSettings"
          />
        </template>
      </UCard>

      <UCard :ui="{ body: { padding: '' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            Sales Channel Summary
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
        :ui="{ body: { base: 'space-y-4' } }"
      >
        <template #header>
          <h3 class="font-bold font-mono">
            Copy Purchase Link
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
    </template>

    <NuxtPage :transition="false" />
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { CHAIN_EXPLORER_URL, IS_TESTNET, LIKE_CO_API } from '~/constant'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'
import { useWalletStore } from '~/stores/wallet'
import { getPortfolioURL } from '~/utils'
import { getNFTAuthzGrants, shortenWalletAddress } from '~/utils/cosmos'

const store = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const nftStore = useNftStore()
const collectionStore = useCollectionStore()
const { token } = storeToRefs(bookStoreApiStore)
const { wallet } = storeToRefs(store)
const { updateNFTBookCollectionById } = collectionStore
const { getClassMetadataById, lazyFetchClassMetadataById } = nftStore

const route = useRoute()
const toast = useToast()

const error = ref('')
const isLoading = ref(false)
const collectionId = ref(route.params.collectionId)
const fromChannel = ref<string | undefined>(undefined)
const collectionListingInfo = ref<any>({})
const ordersData = ref<any>({})
const connectStatus = ref<any>({})

// Search
const searchInput = ref('')

const moderatorWallets = ref<string[]>([])
const moderatorWalletsGrants = ref<any>({})
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const stripeConnectWalletInput = ref('')
const mustClaimToView = ref(false)
const hideDownload = ref(false)
const useLikerLandPurchaseLink = ref(true)

const collectionName = computed(() => collectionStore.getCollectionById(collectionId.value as string)?.name)
const ownerWallet = computed(() => collectionListingInfo?.value?.ownerWallet)
const orderHasShipping = computed(() => purchaseList.value.find((p: any) => !!p.shippingStatus))
const userIsOwner = computed(() => wallet.value && ownerWallet.value === wallet.value)
const userCanSendNFT = computed(() => userIsOwner.value || (wallet.value && moderatorWalletsGrants.value[wallet.value]))
const purchaseLink = computed(() => {
  const payload: Record<string, string> = {
    from: fromChannel.value || ''
  }
  const queryString = `?${new URLSearchParams(payload).toString()}`
  const likerLandLink = `https://${IS_TESTNET ? 'rinkeby.' : ''}liker.land/nft/collection/${collectionId.value}${queryString}`
  const apiLink = `https://api.${IS_TESTNET ? 'rinkeby.' : ''}like.co/likernft/book/collection/purchase/${collectionId.value}/new${queryString}`
  return useLikerLandPurchaseLink.value ? likerLandLink : apiLink
})
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

const shippingRatesTableRows = computed(() => {
  if (!collectionListingInfo.value.shippingRates) {
    return []
  }
  return collectionListingInfo.value.shippingRates.map((r: any, index: number) => ({
    index: index + 1,
    name: r.name,
    price: r.priceInDecimal / 100
  }))
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
    { key: 'email', label: 'Buyer Email', sortable: true },
    { key: 'wallet', label: 'Buyer Wallet', sortable: true },
    { key: 'message', label: 'Buyer Message', sortable: false }
  )

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
  email: p.email,
  status: p.status,
  statusLabel: getStatusLabel(p),
  statusLabelColor: getStatusLabelColor(p),
  orderDate: p.formattedDate,
  shippingStatus: p.shippingStatus,
  wallet: p.wallet || '',
  walletLink: getPortfolioURL(p.wallet),
  shortenWallet: shortenWalletAddress(p.wallet),
  priceName: p.priceName,
  price: p.price || 0,
  message: p.message || '',
  from: p.from || '',
  actions: getOrdersTableActionItems(p)
})).filter((p: any) => {
  if (!searchInput.value) { return true }
  const normalizedSearchInput = searchInput.value.toLowerCase()
  return (
    p.email.toLowerCase().includes(normalizedSearchInput) ||
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
    stripeConnectWallet.value = classConnectedWallets && Object.keys(classConnectedWallets)[0]
    if (stripeConnectWallet.value !== ownerWallet.value) {
      stripeConnectWalletInput.value = stripeConnectWallet.value
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

    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${wallet.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    if (fetchError.value && fetchError.value?.statusCode !== 404) {
      throw new Error(fetchError.value.toString())
    }
    connectStatus.value = (data.value as any) || {}
    collectionListingInfo.value.classIds.forEach((classId: string) => lazyFetchClassMetadataById(classId))
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
})

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
      body: { txHash: null },
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

function onStripeConnectWalletInput () {
  // force stripeConnectWallet to update when stripeConnectWalletInput is updated
  stripeConnectWallet.value = stripeConnectWalletInput.value.trim()
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

    if (isStripeConnectChecked.value && stripeConnectWallet.value) {
      const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${stripeConnectWallet.value}`)
      if (fetchError.value && fetchError.value?.statusCode !== 404) {
        throw new Error(fetchError.value.toString())
      }
      if (!(data?.value as any)?.isReady) {
        throw new Error('CONNECTED_WALLET_STRIPE_ACCOUNT_NOT_READY')
      }
    }

    const connectedWallets = (isStripeConnectChecked.value && stripeConnectWallet.value)
      ? {
          [stripeConnectWallet.value]: 100
        }
      : null
    await updateNFTBookCollectionById(collectionId.value as string, {
      classIds: collectionListingInfo?.value.classIds,
      name: collectionListingInfo?.value.name,
      description: collectionListingInfo?.value.description,
      moderatorWallets,
      notificationEmails,
      connectedWallets,
      hideDownload,
      mustClaimToView
    })
  } catch (err) {
    const errorData = (err as any).data || err
    console.error(errorData)
    error.value = errorData
  } finally {
    isLoading.value = false
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

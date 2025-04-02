<template>
  <PageBody class="space-y-10 pb-10">
    <div class="flex justify-between gap-4">
      <h1 class="text-lg font-bold font-mono flex-wrap">
        NFT Book Status "{{ nftClassName || classId }}"
      </h1>

      <div class="flex justify-center items-center gap-2 flex-wrap">
        <UButton
          class="font-mono break-all"
          label="Gift Books"
          icon="i-heroicons-gift"
          :to="{
            name: 'nft-book-store-gift-classId',
            params: { classId }
          }"
          color="pink"
          variant="outline"
          target="_blank"
        />

        <UButton
          label="View in liker.land"
          icon="i-heroicons-arrow-top-right-on-square"
          variant="outline"
          :to="`${LIKER_LAND_URL}/nft/class/${classId}`"
          target="_blank"
        />
      </div>
    </div>

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
      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { padding: '12px' },
        }"
      >
        <div class="flex justify-between items-center w-full">
          <h3 class="font-bold font-mono">
            Book Details (Metadata)
          </h3>
          <UButton
            label="View / Edit"
            @click="showEditISCNModal = true"
          />
        </div>
      </UCard>

      <UCard :ui="{ body: { padding: '' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            Book Listing Status
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
              pendingAction: classListingInfo.pendingNFTCount || 0,
              sold: classListingInfo.sold || 0,
              stock: classListingInfo.stock || 0
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
          <div class="flex justify-between items-center">
            <h3 class="font-bold font-mono">
              Editions
            </h3>
            <div class="flex justify-between items-center gap-4">
              <div>
                Unassigned Stock : {{ unassignedStock }}
              </div>
              <UButton
                icon="i-heroicons-plus-circle"
                label="Mint New Stock"
                @click="handleOpenRestockModal"
              />
            </div>
          </div>
        </template>

        <table class="w-full divide-y text-sm">
          <thead class="border-b-2">
            <tr class="text-left">
              <th class="px-3 py-4">
                Order
              </th>
              <th class="px-3 py-4">
                Name
              </th>
              <th class="px-3 py-4 text-right">
                stock
              </th>
              <th class="px-3 py-4 text-right">
                Price (USD)
              </th>
              <th v-if="userIsOwner && prices.length > 1" class="px-3 py-4 text-center">
                Sort
              </th>
              <th v-if="userIsOwner" class="px-3 py-4 text-center">
                Details
              </th>
            </tr>
          </thead>
          <Draggable
            v-model="prices"
            tag="tbody"
            item-key="index"
            handle="td.cursor-grab"
            drag-class="bg-white"
            ghost-class="opacity-20"
            :disabled="!userIsOwner || isUpdatingPricesOrder"
            @end="handlePriceReorder"
          >
            <template #item="{ element, index }">
              <tr>
                <td class="px-3 py-4">
                  {{ index + 1 }}
                </td>
                <td class="px-3 py-4">
                  <template v-if="typeof element.name === 'object'">
                    <UCard :ui="{ body: { padding: '' } }">
                      <UTable
                        :columns="[{ key: 'locale', label: 'Locale' }, { key: 'content', label: 'Content' }]"
                        :rows="Object.entries(element.name).map(([locale, content]) => ({ locale, content }))"
                      >
                        <template #locale-data="{ row }">
                          <UBadge
                            :label="row.locale"
                            variant="subtle"
                            :ui="{
                              font: 'font-mono',
                              rounded: 'rounded-full',
                            }"
                          />
                        </template>
                      </UTable>
                    </UCard>
                  </template>
                  <template v-else>
                    {{ element.name }}
                  </template>
                </td>
                <td :class="['px-3', 'py-4', 'text-right', { 'text-red-500': element.stock <= 3 }]">
                  {{ element.stock }}
                </td>
                <td class="px-3 py-4 text-right">
                  {{ element.price }}
                </td>
                <td
                  v-if="userIsOwner && prices.length > 1"
                  class="px-3 py-4 text-center cursor-grab"
                >
                  <UIcon
                    name="i-heroicons-arrows-up-down"
                    color="gray"
                  />
                </td>
                <td class="text-center">
                  <UButton
                    icon="i-heroicons-document-magnifying-glass"
                    :to="{
                      name: 'nft-book-store-status-classId-edit-editionIndex',
                      params: { classId, editionIndex: element.index }
                    }"
                    variant="soft"
                    color="gray"
                  />
                </td>
              </tr>
            </template>
          </Draggable>
        </table>
        <div class="flex justify-center items-center ">
          <UButton
            icon="i-heroicons-plus-circle"
            class="mb-[12px]"
            label="New Edition"
            :to="{
              name: 'nft-book-store-status-classId-edit-new',
              params: { classId },
              query: { price_index: prices.length }
            }"
          />
        </div>
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
            <UFormGroup label="Table Of Content / 章節目錄">
              <UTextarea v-model="tableOfContents" />
            </UFormGroup>

            <!-- Shipping Rates -->
            <ShippingRatesRateTable
              :is-show-physical-goods-checkbox="false"
              :is-loading="isUpdatingShippingRates"
              :shipping-info="classListingInfo.shippingRates"
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

            <!-- DRM -->
            <UCard :ui="{ body: { base: 'space-y-8' } }">
              <template #header>
                <h3 class="font-bold font-mono">
                  DRM Options / 數位版權管理選項
                </h3>
              </template>

              <div class="grid md:grid-cols-2 gap-4">
                <UFormGroup
                  label="Force NFT claim before view"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="mustClaimToView"
                    name="mustClaimToView"
                    label="Must claim NFT to view"
                  />
                </UFormGroup>

                <UFormGroup
                  label="Disable File Download "
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="hideDownload"
                    name="hideDownload"
                    label="Disable Download"
                  />
                </UFormGroup>

                <UFormGroup
                  label="Insert cutomized message page in eBook"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="enableCustomMessagePage"
                    name="enableCustomMessagePage"
                    label="Enable custom message page"
                  />
                </UFormGroup>
              </div>
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

              <UFormGroup label="Price" :required="true">
                <USelect v-model="priceIndex" :options="priceIndexOptions" />
              </UFormGroup>

              <UFormGroup label="Sales channel for the link(s)" hint="Optional">
                <UInput v-model="fromChannelInput" placeholder="Channel ID(s), separated by commas (e.g. store01, store02)" />
              </UFormGroup>

              <UCard
                v-if="purchaseLinks.length > 1"
                :ui="{
                  header: { base: 'flex justify-between items-center' },
                  body: { padding: '' },
                }"
              >
                <template #header>
                  <h4 class="text-sm font-bold font-mono">
                    All Purchase Links
                  </h4>

                  <UDropdown
                    :items="[
                      [
                        {
                          label: 'Print All QR Codes',
                          icon: 'i-heroicons-qr-code',
                          click: printAllQRCodes,
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
                  :columns="[
                    { key: 'index', label: '#' },
                    { key: 'channel', label: 'Channel ID' },
                    { key: 'link', label: 'Purchase Link' },
                  ]"
                  :rows="purchaseLinks"
                  :ui="{ thead: 'whitespace-nowrap' }"
                >
                  <template #index-data="{ index }">
                    {{ index + 1 }}
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
                        size="xs"
                        variant="outline"
                        :disabled="!row.url"
                        @click="copyPurchaseLink(row.url)"
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
              <div v-else-if="purchaseLinks[0]" class="flex items-center gap-2">
                <UButton
                  icon="i-heroicons-qr-code"
                  variant="outline"
                  size="xs"
                  @click="selectedPurchaseLink = purchaseLinks[0]"
                />
                <UButton
                  icon="i-heroicons-document-duplicate"
                  size="xs"
                  variant="outline"
                  :disabled="!purchaseLinks[0]?.url"
                  @click="copyPurchaseLink(purchaseLinks[0]?.url)"
                />
                <UButton
                  icon="i-heroicons-arrow-top-right-on-square"
                  :to="purchaseLinks[0].url"
                  target="_blank"
                  size="xs"
                  variant="outline"
                />
                <UInput
                  class="grow font-mono"
                  :model-value="purchaseLinks[0].url"
                  :disabled="true"
                  color="gray"
                  variant="outline"
                  size="xs"
                />
              </div>
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

    <EditISCNMetadataModal
      v-model="showEditISCNModal"
      :class-id="classId"
    />

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
    <UModal v-model="showRestockModal">
      <LiteMintNFT :iscn-id="iscnId" @submit="handleMintNFTSubmit" />
    </UModal>

    <NuxtPage :transition="false" />
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Draggable from 'vuedraggable'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'
import { useWalletStore } from '~/stores/wallet'
import { useStripeStore } from '~/stores/stripe'
import { getPortfolioURL, downloadFile, convertArrayOfObjectsToCSV, getPurchaseLink, formatShippingAddress } from '~/utils'
import { shortenWalletAddress } from '~/utils/cosmos'

const { CHAIN_EXPLORER_URL, LIKE_CO_API, LIKER_LAND_URL } = useRuntimeConfig().public
const store = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const nftStore = useNftStore()
const stripeStore = useStripeStore()
const { token } = storeToRefs(bookStoreApiStore)
const { wallet } = storeToRefs(store)
const { updateBookListingSetting, reduceListingPendingNFTCountById } = bookStoreApiStore
const { lazyFetchClassMetadataById } = nftStore
const { fetchStripeConnectStatusByWallet } = stripeStore

const route = useRoute()
const router = useRouter()
const toast = useToast()

const error = ref('')
const isLoading = ref(false)
const classId = ref<string>(route.params.classId as string)
const fromChannelInput = ref('')
const priceIndex = ref(0)
const classListingInfo = ref<any>({})
const prices = ref<any[]>([])
const isUpdatingPricesOrder = ref(false)
const ordersData = ref<any>({})
const isUpdatingShippingRates = ref(false)
const shouldShowAdvanceSettings = ref<boolean>(false)
const showEditISCNModal = ref(false)

// Search
const searchInput = ref('')

const tableOfContents = ref('')

const moderatorWallets = ref<string[]>([])
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const isStripeConnectChecked = ref(false)
const stripeConnectWallet = ref('')
const connectedWallets = ref<any>({})
const mustClaimToView = ref(true)
const hideDownload = ref(false)
const enableCustomMessagePage = ref(true)
const useLikerLandPurchaseLink = ref(true)
const shouldDisableStripeConnectSetting = ref(false)
const isUsingDefaultAccount = ref(true)

// Restock
const unassignedStock = ref(0)
const showRestockModal = ref(false)
const iscnId = ref('')

const nftClassName = computed(() => nftStore.getClassMetadataById(classId.value as string)?.name)
const ownerWallet = computed(() => classListingInfo?.value?.ownerWallet)
const orderHasShipping = computed(() => purchaseList.value.find((p: any) => !!p.shippingStatus))
const userIsOwner = computed(() => wallet.value && ownerWallet.value === wallet.value)
const userCanSendNFT = computed(() => userIsOwner.value)
const purchaseLinks = computed(() =>
  fromChannelInput.value
    .split(',')
    .filter((c, index) => !!c || index === 0)
    .map(c => c.trim())
    .map(channel => ({
      channel,
      url: getPurchaseLink({
        classId: classId.value,
        priceIndex: priceIndex.value,
        channel,
        isUseLikerLandLink: useLikerLandPurchaseLink.value
      })
    }))
)

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
    { key: 'priceName', label: 'Price Name', sortable: false },
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

function getQRCodeFilename (channel = '') {
  const filenameParts = [`${nftClassName.value || classId.value}`, `price_${priceIndex.value}`]
  if (channel) {
    filenameParts.push(`channel_${channel}`)
  }
  return filenameParts.join('_')
}

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
        name: 'nft-book-store-send-classId',
        params: {
          classId: purchaseListItem.classId
        },
        query: {
          owner_wallet: ownerWallet.value,
          payment_id: purchaseListItem.id
        }
      }
    }])
  }

  if (purchaseListItem.shippingStatus) {
    actionItems.push([{
      label: 'Handle Shipping',
      icon: 'i-heroicons-truck',
      to: {
        name: 'nft-book-store-send-shipping-classId',
        params: {
          classId: purchaseListItem.classId
        },
        query: {
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
      if (purchaseListItem.shippingStatus === 'pending') {
        return 'Pending Shipping'
      }
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
  readerEmail: p.giftInfo?.toEmail || p.email,
  buyerEmail: p.email,
  buyerPhone: p.phone || '',
  status: p.status,
  statusLabel: getStatusLabel(p),
  statusLabelColor: getStatusLabelColor(p),
  orderDate: p.formattedDate,
  shippingStatus: p.shippingStatus || '',
  shippingCountry: p.shippingDetails?.address?.country || '',
  shippingAddress: formatShippingAddress(p.shippingDetails) || '',
  shippingName: p.shippingDetails?.name || '',
  wallet: p.wallet || '',
  walletLink: getPortfolioURL(p.wallet),
  shortenWallet: shortenWalletAddress(p.wallet),
  priceName: p.priceName,
  price: p.price || 0,
  coupon: p.coupon || '',
  message: p.message || '',
  from: p.from || '',
  quantity: p.quantity || 1,
  actions: getOrdersTableActionItems(p)
})).filter((p: any) => {
  if (!searchInput.value) { return true }
  const normalizedSearchInput = searchInput.value.toLowerCase()
  return (
    p.readerEmail.toLowerCase().includes(normalizedSearchInput) ||
    p.buyerEmail.toLowerCase().includes(normalizedSearchInput) ||
    p.buyerPhone.toLowerCase().includes(normalizedSearchInput) ||
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
      { key: 'remove', label: '', sortable: false }
    )
  }

  return columns
})

const moderatorWalletsTableRows = computed(() => moderatorWallets.value.map((wallet, index) => {
  return {
    index,
    wallet,
    shortenWallet: shortenWalletAddress(wallet),
    walletLink: getPortfolioURL(wallet)
  }
}))

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

const priceIndexOptions = computed(() => classListingInfo.value.prices?.map((p: any, index: number) => ({
  label: `${p.name.en || p.name} - $${p.price}`,
  value: index,
  disabled: index === priceIndex.value
})))

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

onMounted(async () => {
  isLoading.value = true
  try {
    const classData = await $fetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
    classListingInfo.value = classData
    prices.value = classListingInfo.value.prices
    const {
      moderatorWallets: classModeratorWallets,
      notificationEmails: classNotificationEmails,
      connectedWallets: classConnectedWallets,
      mustClaimToView: classMustClaimToView,
      tableOfContents: classTableOfContent,
      enableCustomMessagePage: classEnableCustomMessagePage,
      hideDownload: classHideDownload
    } = classData as any
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
    mustClaimToView.value = classMustClaimToView
    hideDownload.value = classHideDownload
    enableCustomMessagePage.value = classEnableCustomMessagePage
    tableOfContents.value = classTableOfContent
    const orders = await $fetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/orders`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })

    ordersData.value = orders
    await calculateStock()
    if (wallet.value) {
      try {
        await fetchStripeConnectStatusByWallet(wallet.value)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    }
    lazyFetchClassMetadataById(classId.value as string)
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
})

async function calculateStock () {
  const pendingNFTCount = classListingInfo.value.pendingNFTCount || 0
  const { nfts } = await getNFTs({ classId: classId.value, owner: wallet.value })
  const manuallyDeliveredNFTs = prices.value
    .filter(price => !price.isAutoDeliver)
    .reduce((total, price) => total + (price.stock || 0), 0)
  unassignedStock.value = Math.max((nfts?.length - manuallyDeliveredNFTs - pendingNFTCount) || 0, 0)
}

async function handlePriceReorder ({
  newIndex: newOrder,
  oldIndex: oldOrder
}: any) {
  if (newOrder === oldOrder) {
    return
  }
  try {
    isUpdatingPricesOrder.value = true
    const priceIndex = prices.value[newOrder].index
    await $fetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}/price/${priceIndex}/order`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token.value}`
      },
      body: {
        order: newOrder
      }
    })
    prices.value = prices.value.map((p, order) => ({ ...p, order }))
    classListingInfo.value.prices = prices.value
    toast.add({
      icon: 'i-heroicons-check-circle',
      title: 'Updated editions order successfully',
      timeout: 0,
      color: 'green'
    })
  } catch (err) {
    prices.value = classListingInfo.value.prices
    error.value = (err as Error).toString()
  } finally {
    isUpdatingPricesOrder.value = false
  }
}

async function sendReminderEmail (purchase: any) {
  const orderData = ordersData.value?.orders?.find((p: any) => p.id === purchase.id)
  if (!orderData) {
    throw new Error('ORDER_NOT_FOUND')
  }

  await $fetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/status/${purchase.id}/remind`,
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })

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

  try {
    await $fetch(`${LIKE_CO_API}/likernft/book/purchase/${classId.value}/sent/${purchase.id}`,
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
    classListingInfo.value.pendingNFTCount -= 1
    reduceListingPendingNFTCountById(classId.value, 1)
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
    await updateBookListingSetting(classId.value as string, {
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
    await updateBookListingSetting(classId.value as string, {
      moderatorWallets: moderatorWallets.value,
      notificationEmails: notificationEmails.value,
      connectedWallets: newConnectedWallets,
      hideDownload: hideDownload.value,
      mustClaimToView: mustClaimToView.value,
      tableOfContents: tableOfContents.value,
      enableCustomMessagePage: enableCustomMessagePage.value
    })
    router.push({
      name: 'nft-book-store'
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
    await updateBookListingSetting(classId.value as string, {
      shippingRates: value
    })
    const classData = await $fetch(
      `${LIKE_CO_API}/likernft/book/store/${classId.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    classListingInfo.value = classData
  } catch (err) {
    const errorData = (err as any).data || err
    error.value = errorData
  } finally {
    isUpdatingShippingRates.value = false
  }
}

async function copyPurchaseLink (text = '') {
  await navigator.clipboard.writeText(text)
  toast.add({
    icon: 'i-heroicons-check-circle',
    title: 'Copied purchase link to clipboard',
    timeout: 2000,
    color: 'green'
  })
}

function downloadAllPurchaseLinks () {
  downloadFile({
    data: purchaseLinks.value,
    fileName: `${classId.value}_purchase_links.csv`,
    fileType: 'csv'
  })
}

function printAllQRCodes () {
  try {
    sessionStorage.setItem(
      'nft_book_press_batch_qrcode',
      convertArrayOfObjectsToCSV(purchaseLinks.value.map(({ channel, ...link }) => ({ key: channel, ...link })))
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
      convertArrayOfObjectsToCSV(purchaseLinks.value.map(({ channel, url }) => ({ key: channel, url })))
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

function handleOpenRestockModal () {
  showRestockModal.value = true
  iscnId.value = classId.value
}

async function handleMintNFTSubmit () {
  await calculateStock()
  showRestockModal.value = false
}

</script>

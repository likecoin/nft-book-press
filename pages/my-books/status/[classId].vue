<template>
  <PageBody class="space-y-10 pb-10">
    <div class="flex justify-between gap-4">
      <h1 class="text-lg font-bold font-mono flex-wrap">
        {{ $t('pages.nft_book_status') }} "{{ nftClassName || classId }}"
      </h1>

      <div class="flex justify-center items-center gap-2 flex-wrap">
        <UButton
          class="font-mono break-all"
          :label="$t('buttons.gift_books')"
          icon="i-heroicons-gift"
          :to="localeRoute({
            name: 'my-books-gift-classId',
            params: { classId }
          })"
          color="pink"
          variant="outline"
          target="_blank"
        />

        <UButton
          :label="$t('buttons.view_in_3ook')"
          icon="i-heroicons-arrow-top-right-on-square"
          variant="outline"
          :to="`${BOOK3_URL}/store/${classId}`"
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
        {{ $t('loading.progress') }}
      </template>
    </UProgress>

    <template v-if="bookstoreApiStore.isAuthenticated">
      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { padding: '12px' },
        }"
      >
        <div class="flex justify-between items-center w-full">
          <h3 class="font-bold font-mono">
            {{ $t('pages.book_details_metadata') }}
          </h3>
          <UButton
            :label="$t('buttons.view_edit')"
            @click="showEditISCNModal = true"
          />
        </div>
      </UCard>

      <UCard :ui="{ body: { padding: '' } }">
        <template #header>
          <h3 class="font-bold font-mono">
            {{ $t('pages.book_listing_status') }}
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
          <div class="flex justify-between items-center">
            <h3 class="font-bold font-mono">
              {{ $t('pages.editions') }}
            </h3>
            <div class="flex justify-between items-center gap-4">
              <div>
                {{ $t('table.unassigned_stock') }} : {{ unassignedStock }}
              </div>
              <UButton
                icon="i-heroicons-plus-circle"
                :label="$t('buttons.mint_new_stock')"
                @click="handleOpenRestockModal"
              />
            </div>
          </div>
        </template>

        <table class="w-full divide-y text-sm">
          <thead class="border-b-2">
            <tr class="text-left">
              <th class="px-3 py-4">
                {{ $t('table.order') }}
              </th>
              <th class="px-3 py-4">
                {{ $t('table.name') }}
              </th>
              <th class="px-3 py-4 text-right">
                {{ $t('table.stock') }}
              </th>
              <th class="px-3 py-4 text-right">
                {{ $t('table.price_usd') }}
              </th>
              <th v-if="userIsOwner && prices.length > 1" class="px-3 py-4 text-center">
                {{ $t('table.sort') }}
              </th>
              <th v-if="userIsOwner" class="px-3 py-4 text-center">
                {{ $t('table.details') }}
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
                        :columns="[{ key: 'locale', label: $t('table.locale') }, { key: 'content', label: $t('table.content') }]"
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
                    :to="localeRoute({
                      name: 'my-books-status-classId-edit-editionIndex',
                      params: { classId, editionIndex: element.index }
                    })"
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
            :label="$t('form.add_edition')"
            :to="localeRoute({
              name: 'my-books-status-classId-edit-new',
              params: { classId },
              query: { price_index: prices.length }
            })"
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
            {{ $t('pages.sales_channel_summary') }}
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
            <UFormGroup :label="$t('form.table_of_content')">
              <UTextarea v-model="tableOfContents" />
            </UFormGroup>

            <!-- Share sales data -->
            <UCard
              :ui="{
                header: { base: 'flex justify-between items-center' },
                body: { padding: '', base: 'space-y-8' }
              }"
            >
              <template #header>
                <h4 class="text-sm font-bold font-mono">
                  {{ $t('form.share_sales_data') }}
                </h4>
                <div class="flex gap-2">
                  <UInput
                    v-model="moderatorWalletInput"
                    class="font-mono"
                    placeholder="0x..."
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

            <!-- DRM -->
            <UCard :ui="{ body: { base: 'space-y-8' } }">
              <template #header>
                <h3 class="font-bold font-mono">
                  DRM Options / 數位版權管理選項
                </h3>
              </template>

              <div class="grid md:grid-cols-2 gap-4">
                <UFormGroup
                  :label="$t('form.force_nft_claim')"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="mustClaimToView"
                    name="mustClaimToView"
                    :label="$t('form.must_claim_to_view')"
                  />
                </UFormGroup>

                <UFormGroup
                  :label="$t('form.disable_file_download')"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="hideDownload"
                    name="hideDownload"
                    :label="$t('form.disable_download')"
                  />
                </UFormGroup>

                <UFormGroup
                  :label="$t('form.custom_message_page')"
                  :ui="{ label: { base: 'font-mono font-bold' } }"
                >
                  <UCheckbox
                    v-model="enableCustomMessagePage"
                    name="enableCustomMessagePage"
                    :label="$t('form.enable_custom_message')"
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
                  {{ $t('form.copy_purchase_link') }}
                </h3>
              </template>

              <div>
                <UToggle v-model="useLikerLandPurchaseLink" />
                {{ $t('form.use_liker_land_link') }}
              </div>

              <UFormGroup :label="$t('form.price')" :required="true">
                <USelect v-model="priceIndex" :options="priceIndexOptions" />
              </UFormGroup>

              <UFormGroup :label="$t('form.sales_channel_for_links')" :hint="$t('common.optional')">
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
                    {{ $t('purchase_link.download_all_links') }}
                  </h4>

                  <UDropdown
                    :items="[
                      [
                        {
                          label: $t('buttons.print_all_qr'),
                          icon: 'i-heroicons-qr-code',
                          click: printAllQRCodes,
                        },
                        {
                          label: $t('buttons.download_all_links'),
                          icon: 'i-heroicons-arrow-down-on-square-stack',
                          click: downloadAllPurchaseLinks,
                        },
                        {
                          label: $t('buttons.shorten_all_links'),
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
                    { key: 'channel', label: $t('table.channel_id') },
                    { key: 'link', label: $t('purchase_link.download_links') },
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
        :label="$t('common.save')"
        :loading="isLoading"
        size="lg"
        :disabled="isLoading"
        @click="updateSettings"
      />
    </template>

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
            {{ $t('purchase_link.download_qr_modal') }}
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
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'
import { useWalletStore } from '~/stores/wallet'
import { useStripeStore } from '~/stores/stripe'
import { getPortfolioURL, downloadFile, convertArrayOfObjectsToCSV, getPurchaseLink } from '~/utils'
import { shortenWalletAddress } from '~/utils/cosmos'
import { getApiEndpoints } from '~/constant/api'
const { t: $t } = useI18n()

const { CHAIN_EXPLORER_URL, BOOK3_URL, LIKE_CO_API } = useRuntimeConfig().public
const store = useWalletStore()
const bookstoreApiStore = useBookstoreApiStore()
const nftStore = useNftStore()
const stripeStore = useStripeStore()
const { token } = storeToRefs(bookstoreApiStore)
const { wallet } = storeToRefs(store)
const { updateBookListingSetting, reduceListingPendingNFTCountById } = bookstoreApiStore
const { lazyFetchClassMetadataById } = nftStore
const { fetchStripeConnectStatusByWallet } = stripeStore
const { getBalanceOf } = useNFTContractReader()

const route = useRoute()
const localeRoute = useLocaleRoute()
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
    { key: 'actions', label: $t('table.actions'), sortable: false },
    { key: 'orderDate', label: $t('table.order_date'), sortable: true },
    { key: 'status', label: $t('table.status'), sortable: true }
  ]
  columns.push(
    { key: 'from', label: $t('table.sales_channel'), sortable: true },
    { key: 'price', label: $t('form.price'), sortable: true },
    { key: 'priceName', label: $t('table.price_name'), sortable: false },
    { key: 'quantity', label: $t('table.quantity'), sortable: true },
    { key: 'coupon', label: $t('table.coupon_applied'), sortable: false },
    { key: 'buyerEmail', label: $t('table.buyer_email'), sortable: true },
    { key: 'readerEmail', label: $t('table.reader_email'), sortable: true },
    { key: 'wallet', label: $t('table.reader_wallet'), sortable: true },
    { key: 'message', label: $t('table.reader_message'), sortable: false }
  )

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
      label: $t('status_page.view_transaction'),
      icon: 'i-heroicons-magnifying-glass',
      to: `${CHAIN_EXPLORER_URL}/${purchaseListItem.txHash}`,
      target: '_blank'
    }])
  } else if (purchaseListItem.status === 'pendingNFT' && userCanSendNFT.value) {
    actionItems.push([{
      label: 'Send NFT',
      icon: 'i-heroicons-paper-airplane',
      to: localeRoute({
        name: 'my-books-send-classId',
        params: {
          classId: purchaseListItem.classId
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
      label: $t('status_page.send_reminder_email'),
      icon: 'i-heroicons-envelope',
      click: () => {
        sendReminderEmail(purchaseListItem)
      }
    }])
  }

  if (['pendingNFT', 'paid'].includes(purchaseListItem.status)) {
    actionItems.push([{
      label: $t('status_page.mark_complete'),
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
  const columns = [{ key: 'wallet', label: $t('table.wallet'), sortable: true }]

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
  const count = await getBalanceOf(classId.value, wallet.value as string)
  const manuallyDeliveredNFTs = prices.value
    .filter(price => !price.isAutoDeliver)
    .reduce((total, price) => total + (price.stock || 0), 0)
  unassignedStock.value = Math.max((Number(count) - manuallyDeliveredNFTs - pendingNFTCount) || 0, 0)
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
    title: $t('status_page.send_reminder_email'),
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
      throw new Error($t('errors.add_moderator_wallet'))
    }
    if (notificationEmailInput.value) {
      throw new Error($t('errors.add_notification_email'))
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
    await navigateTo(localeRoute({
      name: 'my-books'
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

async function copyPurchaseLink (text = '') {
  await navigator.clipboard.writeText(text)
  toast.add({
    icon: 'i-heroicons-check-circle',
    title: $t('purchase_link.copied_to_clipboard'),
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
      title: $t('purchase_link.failed_print_qr'),
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  }
}

async function shortenAllLinks () {
  try {
    sessionStorage.setItem(
      'nft_book_press_batch_shorten_url',
      convertArrayOfObjectsToCSV(purchaseLinks.value.map(({ channel, url }) => ({ key: channel, url })))
    )
    await navigateTo(localeRoute({ name: 'batch-short-links', query: { print: 1 } }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: $t('purchase_link.failed_shorten_links'),
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

function isContentFingerprintEncrypted (contentFingerprints: any[]) {
  const apiEndpoints = getApiEndpoints()
  const arweaveLinkEndpoint = apiEndpoints.API_GET_ARWEAVE_V2_LINK
  return contentFingerprints.some((fingerprint) => {
    return !!fingerprint.startsWith(arweaveLinkEndpoint) || fingerprint.includes('?key=')
  })
}

async function handleISCNUpdated ({
  classId,
  metadata
}: {
  classId: string
  metadata: any
}) {
  const { contentFingerprints } = metadata
  if (contentFingerprints) {
    const shouldHideDownload = isContentFingerprintEncrypted(contentFingerprints)
    if (shouldHideDownload !== hideDownload.value) {
      hideDownload.value = shouldHideDownload
    }
    await updateBookListingSetting(classId, {
      hideDownload: shouldHideDownload
    })
  }
}
</script>

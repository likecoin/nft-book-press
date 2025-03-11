<template>
  <PageBody>
    <PageHeader title="Latest Books on Liker Land Bookstore" />
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />
    <UAlert
      v-if="!isAffiliationReady"
      icon="i-heroicons-exclamation-circle"
      color="orange"
      variant="soft"
      title="Join Our Affiliation Program!"
      description="Setup your Liker ID and Stripe Connect Account to participate in sales affiliation program on Liker Land Bookstore."
      :actions="[{
        label: 'Setup',
        color: 'orange',
        variant: 'outline',
        click: handleAffiliationSetupButtonClick,
      }]"
    />
    <UCard v-else>
      Append <UKbd class="font-mono">
        ?from={{ channelId }}
      </UKbd> in any bookstore page to earn commission from book sales.
    </UCard>
    <UTabs v-model="selectedTabItemIndex" class="w-full" :items="tabItems">
      <template #item="{ item }">
        <UCard
          :key="item.key"
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { padding: '' },
            footer: { base: 'text-center' },
          }"
        >
          <div class="flex px-3 py-3.5 border-b border-gray-200">
            <UInput v-model="q" placeholder="Filter books by name or author" />
          </div>
          <UTable :columns="tableColumns" :rows="filteredRows" @select="selectTableRow">
            <template #image-data="{ row }">
              <img v-if="row.image" :src="row.image" :alt="row.className" class="w-12 h-12 object-cover rounded-lg">
            </template>
            <template #className-data="{ row }">
              <div class="max-w-[20vw] whitespace-normal" v-text="row.className" />
            </template>
            <template #url-data="{ row }">
              <UButton label="Copy" :disabled="!isAffiliationReady" @click="handleCopyButtonClick($event, row.url)" />
            </template>
          </UTable>
        </UCard>
      </template>
    </UTabs>
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useUserStore } from '~/stores/user'
import { useStripeStore } from '~/stores/stripe'
import { useWalletStore } from '~/stores/wallet'

const { LIKER_LAND_URL, LIKE_CO_API } = useRuntimeConfig().public

const userStore = useUserStore()
const stripeStore = useStripeStore()
const bookStoreApiStore = useBookStoreApiStore()
const walletStore = useWalletStore()

const router = useRouter()
const route = useRoute()

const { wallet } = storeToRefs(walletStore)
const { userLikerInfo } = storeToRefs(userStore)
const { isAuthenticated } = storeToRefs(bookStoreApiStore)

const tabItems = [
  { label: 'Latest Releases', key: 'latest' },
  { label: 'Best Sellers', key: 'bestselling' }
]

const error = ref('')
const isStripeConnectReady = ref(false)
const latestBookList = ref([])
const bestSellerBookList = ref([] as any[])
const selectedTabItemIndex = ref(0)
const q = ref(route.query.q || '')

const channelId = computed(() => {
  if (userLikerInfo.value?.user) {
    return convertLikerIdToChannelId(userLikerInfo.value?.user)
  }
  return ''
})

const isAffiliationReady = computed(() => isStripeConnectReady.value && channelId.value)

const tableColumns = computed(() => [
  {
    key: 'image',
    label: 'Cover',
    sortable: false
  },
  {
    key: 'className',
    label: 'Book Name',
    sortable: true
  },
  {
    key: 'author',
    label: 'Author',
    sortable: true
  },
  {
    key: 'priceInUSD',
    label: 'Price',
    sortable: true
  }, {
    key: 'url',
    label: isAffiliationReady.value ? 'Affiliation Link' : 'Link',
    sortable: false
  }
])
const selectedTabItemKey = computed(() => tabItems[selectedTabItemIndex.value].key)
const bookList = computed(() => selectedTabItemKey.value === 'latest' ? latestBookList.value : bestSellerBookList.value)
const tableRows = computed(() => bookList.value.map((b: any) => {
  const className = b.name || b.title
  const image = b.thumbnailUrl || b.imageUrl
  const author = b.author?.name || b.author
  return {
    className,
    image: image ? getImageResizeURL(parseImageURLFromMetadata(image)) : undefined,
    author,
    priceInUSD: `US$${b.minPrice || b.prices?.[0]?.price || 0}`,
    url: `${LIKER_LAND_URL}/nft/class/${b.classId}?from=${channelId.value}&utm_source=bookpress&utm_medium=list_${selectedTabItemKey.value}`
  }
}))

const filteredRows = computed(() => {
  if (!q.value) {
    return tableRows.value
  }
  const query = q.value.toLowerCase()
  return tableRows.value.filter((row: any) => {
    return [row.className, row.author].some((value) => {
      return value && value.toLowerCase().includes(query)
    })
  })
})

useSeoMeta({
  title: 'Latest Books',
  ogTitle: 'Latest Books'
})

onMounted(async () => {
  await Promise.all([
    fetchBookList().catch((e) => {
      error.value = e
    }),
    fetchBestSellersList().catch((e) => {
      error.value = e
    })
  ])
  if (isAuthenticated.value) {
    await fetchUserStripeInfo()
  }
})

async function fetchBookList () {
  const data = await $fetch(`${LIKE_CO_API}/likernft/book/store/list?limit=100`)
  latestBookList.value = (data as any)?.list || []
}

async function fetchBestSellersList () {
  const data = await $fetch(`${LIKER_LAND_URL}/api/bookstore/products?tag=bestselling`)
  bestSellerBookList.value = (data as any)?.records || []
}

async function fetchUserStripeInfo () {
  if (!wallet.value) {
    isStripeConnectReady.value = false
    return
  }
  const stripeConnectStatus = await stripeStore.fetchStripeConnectStatusByWallet(wallet.value)
  isStripeConnectReady.value = stripeConnectStatus?.isReady
}

function handleAffiliationSetupButtonClick () {
  useTrackEvent('latest_books_click_affiliation_setup')
  router.push({ name: 'nft-book-store-user' })
}

function selectTableRow (row: any) {
  useTrackEvent('latest_books_click_table_row')
  window.open(row.url, '_blank')
}

function handleCopyButtonClick (e: MouseEvent, text: string) {
  e.stopPropagation()
  useTrackEvent('latest_books_click_copy_button')
  copyToClipboard(text)
}

watch(isAuthenticated, () => {
  if (isAuthenticated.value) {
    nextTick(() => {
      fetchUserStripeInfo()
    })
  }
})

</script>

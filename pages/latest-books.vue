<template>
  <PageBody>
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
    <UCard
      :ui="{
        header: { base: 'flex justify-between items-center' },
        body: { padding: '' },
        footer: { base: 'text-center' },
      }"
    >
      <template #header>
        <h2 class="text-xl font-bold font-mono">
          Latest Books on LikerLand Bookstore
        </h2>
      </template>
      <UTable
        :columns="tableColumns"
        :rows="tableRows"
        @select="selectTableRow"
      >
        <template #image-data="{ row }">
          <img
            :src="row.image"
            :alt="row.className"
            class="w-12 h-12 object-cover rounded-lg"
          >
        </template>
        <template #url-data="{ row }">
          <UButton
            label="Copy"
            @click="e => copyToClipboard(e, row.url)"
          />
        </template>
      </UTable>
    </UCard>
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

const toast = useToast()
const router = useRouter()

const { wallet } = storeToRefs(walletStore)
const { userLikerInfo } = storeToRefs(userStore)
const { isAuthenticated } = storeToRefs(bookStoreApiStore)

const error = ref('')
const isStripeConnectReady = ref(false)
const bookList = ref([])

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
    label: 'Class Name',
    sortable: true
  },
  {
    key: 'author',
    label: 'Author',
    sortable: true
  },
  {
    key: 'priceInUSD',
    label: 'Price in USD',
    sortable: true
  }, {
    key: 'url',
    label: isAffiliationReady.value ? 'Affiliation Link' : 'Link',
    sortable: false
  }
])

const tableRows = computed(() => bookList.value.map((b: any) => ({
  className: b.name,
  image: parseImageURLFromMetadata(b.thumbnailUrl),
  author: b.author,
  priceInUSD: `US$${b.prices[0].price}`,
  url: `${LIKER_LAND_URL}/nft/class/${b.classId}?from=${channelId.value}`
})))

onMounted(() => {
  nextTick(async () => {
    await fetchBookList()
    if (isAuthenticated.value) {
      await fetchUserStripeInfo()
    }
  })
})

async function fetchBookList () {
  const { data, error } = await useFetch(`${LIKE_CO_API}/likernft/book/store/list?limit=100`)
  if (error.value) {
    throw error.value
  }
  bookList.value = (data.value as any)?.list || []
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
  router.push({ name: 'nft-book-store-user' })
}

function selectTableRow (row: any) {
  window.open(row.url, '_blank')
}

function copyToClipboard (e: MouseEvent, text: string) {
  e.stopPropagation()
  navigator.clipboard.writeText(text)
  toast.add({
    icon: 'i-heroicons-clipboard-check-solid',
    title: 'Copied to clipboard',
    color: 'green',
    timeout: 3000
  })
}

watch(isAuthenticated, () => {
  if (isAuthenticated.value) {
    nextTick(() => {
      fetchUserStripeInfo()
    })
  }
})

</script>

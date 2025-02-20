<template>
  <ul v-if="props.isLarge" class="space-y-10">
    <li v-for="item in items" :key="item.label">
      <UCard>
        <template #header>
          <h3 class="text-sm font-bold font-mono">
            {{ item.label }}
          </h3>
        </template>

        <ul class="flex flex-wrap gap-4">
          <li v-for="link in item.links" :key="link.label">
            <UButton
              :label="link.label"
              :leading-icon="link.icon"
              size="xl"
              :to="link.to"
              color="white"
              @click="link.click"
            />
          </li>
        </ul>
      </UCard>
    </li>
  </ul>

  <UAccordion
    v-else
    :items="items"
    :default-open="true"
    :multiple="true"
  >
    <template #item="{ item }">
      <UVerticalNavigation :links="item.links" />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useCollectionStore } from '~/stores/collection'
import { PUBLISHING_NOTICE_URL_EN, PUBLISHING_NOTICE_URL_ZH } from '~/constant'

const { ISCN_TOOLS_URL } = useRuntimeConfig().public
const bookStoreApiStore = useBookStoreApiStore()
const collectionStore = useCollectionStore()
const { getTotalPendingNFTCount } = storeToRefs(bookStoreApiStore)
const { getTotalPendingNFTCount: getCollectionTotalPendingNFTCount } = storeToRefs(collectionStore)

const props = defineProps({
  isLarge: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click-link'])

function handleLinkClick ({ label }: { label?: string }) {
  useTrackEvent(`click-link_${label}`)
  emit('click-link')
}

const items = computed(() => [
  {
    label: 'Publish NFT Book',
    links: [
      {
        label: 'Print New Books',
        icon: 'i-heroicons-sparkles',
        to: { name: 'mint-nft' }
      }
    ]
  },
  {
    label: 'Bookstore & Listing',
    links: [
      {
        label: 'Latest Books',
        icon: 'i-heroicons-book-open',
        to: { name: 'latest-books' },
        exact: true
      },
      {
        label: 'Manage Book Listings',
        icon: 'i-heroicons-rectangle-stack',
        to: { name: 'nft-book-store' },
        exact: true,
        badge: getTotalPendingNFTCount.value
      },
      {
        label: 'Manage Collections',
        icon: 'i-heroicons-rectangle-stack',
        to: { name: 'nft-book-store-collection' },
        exact: true,
        badge: getCollectionTotalPendingNFTCount.value
      }
    ]
  },
  {
    label: 'Authors & Affiliates',
    links: [
      {
        label: 'User Settings',
        icon: 'i-heroicons-user-group',
        to: { name: 'nft-book-store-user' },
        exact: true
      }
    ]
  },
  {
    label: 'Sales Tools',
    links: [
      {
        label: 'Create Purchase Link',
        icon: 'i-heroicons-link',
        to: { name: 'purchase-link' },
        exact: true
      },
      {
        label: 'Bookstore POS',
        icon: 'i-heroicons-shopping-cart',
        to: { name: 'sales-pos' },
        exact: true
      },
      {
        label: 'Batch Create QR Codes',
        icon: 'i-heroicons-qr-code',
        to: { name: 'batch-qrcode' },
        target: '_blank'
      },
      {
        label: 'Batch Create Short Links',
        icon: 'i-heroicons-link',
        to: { name: 'batch-short-links' }
      }
    ]
  }, {
    label: 'Help 幫助',
    links: [
      {
        label: 'Publisher Guide',
        icon: 'i-heroicons-document-text',
        to: 'https://docs.like.co/depub/nft-book-press',
        target: '_blank'
      },
      {
        label: '出版教學',
        icon: 'i-heroicons-document-text',
        to: 'https://docs.like.co/zh/depub/nft-book-press',
        target: '_blank'
      },
      {
        label: 'Listing Disclaimer',
        icon: 'i-heroicons-shield-exclamation',
        to: PUBLISHING_NOTICE_URL_EN,
        target: '_blank'
      },
      {
        label: '上架須知和收費',
        icon: 'i-heroicons-shield-exclamation',
        to: PUBLISHING_NOTICE_URL_ZH,
        target: '_blank'
      },
      {
        label: 'Chat with Us 聯絡我們',
        icon: 'i-heroicons-chat-bubble-bottom-center',
        to: 'https://go.crisp.chat/chat/embed/?website_id=5c009125-5863-4059-ba65-43f177ca33f7',
        target: '_blank'
      }
    ]
  },
  {
    label: 'Misc Tools',
    links: [
      {
        label: 'NFT Authz Grants',
        icon: 'i-heroicons-user-plus',
        to: { name: 'authz' }
      },
      {
        label: 'LikeCoin ISCN/NFT Tools',
        icon: 'i-heroicons-arrow-top-right-on-square',
        to: ISCN_TOOLS_URL,
        target: '_blank'
      }
    ]
  }
].map(item => ({
  ...item,
  links: item.links.map(link => ({
    ...link,
    click: () => handleLinkClick({ label: link.label })
  }))
})))
</script>

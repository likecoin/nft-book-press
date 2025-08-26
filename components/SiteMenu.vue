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
import { useBookstoreApiStore } from '~/stores/book-store-api'
import { useCollectionStore } from '~/stores/collection'
import { PUBLISHING_NOTICE_URL_EN, PUBLISHING_NOTICE_URL_ZH } from '~/constant'
const { t: $t } = useI18n()

const localeRoute = useLocaleRoute()

const bookstoreApiStore = useBookstoreApiStore()
const collectionStore = useCollectionStore()
const { getTotalPendingNFTCount } = storeToRefs(bookstoreApiStore)
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
    label: $t('menu.bookstore_listing'),
    links: [
      {
        label: $t('menu.start_publishing'),
        icon: 'i-heroicons-sparkles',
        to: localeRoute({ name: 'publish-nft-book' })
      },
      {
        label: $t('menu.manage_book_listings'),
        icon: 'i-heroicons-rectangle-stack',
        to: localeRoute({ name: 'nft-book-store' }),
        exact: true,
        badge: getTotalPendingNFTCount.value
      }
    ]
  },
  {
    label: $t('menu.authors_affiliates'),
    links: [
      {
        label: $t('menu.user_settings'),
        icon: 'i-heroicons-user-group',
        to: localeRoute({ name: 'nft-book-store-user' }),
        exact: true
      },
      {
        label: $t('menu.latest_books'),
        icon: 'i-heroicons-book-open',
        to: localeRoute({ name: 'latest-books' }),
        exact: true
      }
    ]
  },
  {
    label: $t('menu.sales_tools'),
    links: [
      {
        label: $t('menu.create_purchase_link'),
        icon: 'i-heroicons-link',
        to: localeRoute({ name: 'purchase-link' }),
        exact: true
      },
      {
        label: $t('menu.bookstore_pos'),
        icon: 'i-heroicons-shopping-cart',
        to: localeRoute({ name: 'sales-pos' }),
        exact: true
      },
      {
        label: $t('menu.batch_create_qr_codes'),
        icon: 'i-heroicons-qr-code',
        to: localeRoute({ name: 'batch-qrcode' }),
        target: '_blank'
      },
      {
        label: $t('menu.batch_create_short_links'),
        icon: 'i-heroicons-link',
        to: localeRoute({ name: 'batch-short-links' })
      }
    ]
  }, {
    label: $t('menu.help'),
    links: [
      {
        label: $t('menu.publisher_guide_zh'),
        icon: 'i-heroicons-document-text',
        to: 'https://docs.like.co/zh/depub/nft-book-press',
        target: '_blank'
      },
      {
        label: $t('menu.listing_disclaimer_zh'),
        icon: 'i-heroicons-shield-exclamation',
        to: PUBLISHING_NOTICE_URL_ZH,
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

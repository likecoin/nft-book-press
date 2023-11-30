<template>
  <UAccordion
    :items="items"
    :default-open="true"
    :multiple="true"
  >
    <template #item="{ item }">
      <UVerticalNavigation
        :links="item.links"
        :ui="{
          icon: props.isLarge ? 'w-12 h-12' : undefined,
          size: props.isLarge ? 'text-xl' : undefined,
        }"
      />
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import { ISCN_TOOLS_URL } from '~/constant'

const props = defineProps({
  isLarge: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click-link'])

function handleLinkClick () {
  emit('click-link')
}

const items = [
  {
    label: 'Mint NFT',
    links: [
      {
        label: 'Mint NFT',
        icon: 'i-heroicons-sparkles',
        to: { name: 'mint-nft' }
      }
    ]
  },
  {
    label: 'NFT Book Press',
    links: [
      {
        label: 'Manage NFT Books',
        icon: 'i-heroicons-rectangle-stack',
        to: { name: 'nft-book-store' },
        exact: true
      },
      {
        label: 'Manage Stripe Account',
        icon: 'i-heroicons-user-group',
        to: { name: 'nft-book-store-user' },
        exact: true
      }
    ]
  },
  {
    label: 'Others',
    links: [
      {
        label: 'NFT Authz Grants',
        icon: 'i-heroicons-user-plus',
        to: { name: 'authz' }
      }
    ]
  },
  {
    label: 'More Tools',
    links: [
      {
        label: 'Batch Create QR Codes',
        icon: 'i-heroicons-qr-code',
        to: { name: 'batch-qrcode' }
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
    click: handleLinkClick
  }))
}))
</script>

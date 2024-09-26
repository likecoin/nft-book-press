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
const { ISCN_TOOLS_URL } = useRuntimeConfig().public

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
        label: 'Manage Book Collection',
        icon: 'i-heroicons-rectangle-stack',
        to: { name: 'nft-book-store-collection' },
        exact: true
      },
      {
        label: 'User Setting',
        icon: 'i-heroicons-user-group',
        to: { name: 'nft-book-store-user' },
        exact: true
      },
      {
        label: 'Affiliation Link',
        icon: 'i-heroicons-user-group',
        to: { name: 'affiliation-link' },
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
        to: { name: 'batch-qrcode' },
        target: '_blank'
      },
      {
        label: 'Batch Create Short Links',
        icon: 'i-heroicons-sparkles',
        to: { name: 'batch-short-links' }
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

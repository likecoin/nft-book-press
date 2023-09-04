<template>
  <nav>
    <ul>
      <li>
        <NuxtLink :to="{ name: 'mint-nft' }">
          Mint NFT
        </NuxtLink>
      </li>
      <li>
        <NuxtLink :to="{ name: 'nft-book-store' }">
          NFT Book Press
        </NuxtLink>
        <ul>
          <li>
            <NuxtLink :to="{ name: 'nft-book-store' }">
              Manage NFT Books
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'nft-book-store-user' }">
              Manage Stripe Account
            </NuxtLink>
          </li>
        </ul>
      </li>
      <li>
        <NuxtLink :to="{ name: 'authz' }">
          NFT authz grants
        </NuxtLink>
      </li>
      <li>
        <a :href="toolsURL" target="_blank">
          More NFT tools
        </a>
      </li>
    </ul>
  </nav>
</template>
<script setup>
import { ISCN_TOOLS_URL } from '~/constant'

const toolsURL = ISCN_TOOLS_URL

</script>

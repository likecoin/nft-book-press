<template>
  <nav class="flex flex-col overflow-y-auto">
    <SiteHeaderBase class="w-full px-5">
      <UButton
        class="font-bold"
        variant="ghost"
        label="LikeCoin NFT Book Press"
        :to="{ name: 'index' }"
      />
      <UBadge
        v-if="IS_TESTNET"
        label="TESTNET"
        variant="subtle"
        color="amber"
        size="xs"
        :ui="{ rounded: 'rounded-full', font: 'font-mono' }"
      />
    </SiteHeaderBase>
    <div class="flex flex-col gap-4 grow w-full p-5 overflow-y-auto">
      <SiteMenu />
    </div>

    <AuthStateView class="p-5 border-t border-gray-200 dark:border-gray-800" />
  </nav>
</template>

<script setup lang="ts">
import { IS_TESTNET } from '~/constant'
</script>

<template>
  <nav class="flex flex-col overflow-y-auto">
    <SiteHeaderBase class="w-full px-5 py-4">
      <AppLogo />
      <UBadge
        v-if="isTestnet"
        :label="$t('app.testnet')"
        variant="subtle"
        color="amber"
        size="xs"
        :ui="{ rounded: 'rounded-full', font: 'font-mono' }"
      />
    </SiteHeaderBase>
    <div class="flex flex-col gap-4 grow w-full p-3 overflow-y-auto">
      <SiteMenu />
    </div>

    <AuthStateView class="p-5 dark:border-gray-800" />
  </nav>
</template>

<script setup lang="ts">
const { t: $t } = useI18n()
const isTestnet = getIsTestnet()
</script>

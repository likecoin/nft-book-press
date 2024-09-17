<template>
  <PageContainer :key="route.path">
    <PageHeader :class="{ hidden: isHeaderHidden }" title="NFT Bookstore Management Page" />

    <AuthRequiredView>
      <NuxtPage />
    </AuthRequiredView>
  </PageContainer>
</template>

<script setup lang="ts">
const route = useRoute()

const isHeaderHidden = computed(() => route.query.print === '1')
</script>

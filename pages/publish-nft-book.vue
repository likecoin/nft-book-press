<template>
  <PageContainer :key="route.path">
    <PageHeader title="發佈你的區塊鏈書" />

    <AuthRequiredView>
      <NuxtPage />
    </AuthRequiredView>
  </PageContainer>
</template>

<script setup lang="ts">
const route = useRoute()

useSeoMeta({
  title: 'Publish your NFT Book',
  ogTitle: 'Publish your NFT Book'
})

</script>

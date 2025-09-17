<template>
  <PageContainer :key="route.path">
    <AuthRequiredView>
      <NuxtPage />
    </AuthRequiredView>
  </PageContainer>
</template>

<script setup lang="ts">
const { t: $t } = useI18n()
const route = useRoute()

useSeoMeta({
  title: () => $t('seo_titles.publish_nft_book'),
  ogTitle: () => $t('seo_titles.publish_nft_book')
})

</script>

<template>
  <PageContainer :key="route.path">
    <PageHeader :class="{ hidden: isHeaderHidden }" title="Liker Land Bookstore Management Page" />

    <AuthRequiredView>
      <NuxtPage />
    </AuthRequiredView>
  </PageContainer>
</template>

<script setup lang="ts">
const { t: $t } = useI18n()
const route = useRoute()

const isHeaderHidden = computed(() => route.query.print === '1')

useSeoMeta({
  title: $t('seo_titles.book_listing_management'),
  ogTitle: $t('seo_titles.book_listing_management')
})

</script>

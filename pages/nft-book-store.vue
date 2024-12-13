<template>
  <PageContainer :key="route.path">
    <PageHeader :class="{ hidden: isHeaderHidden }" title="Liker Land Bookstore Management Page" />

    <AuthRequiredView>
      <NuxtPage />
    </AuthRequiredView>
  </PageContainer>
</template>

<script setup lang="ts">
const route = useRoute()

const isHeaderHidden = computed(() => route.query.print === '1')

useSeoMeta({
  title: 'Book Listing Management',
  ogTitle: 'Book Listing Management'
})

</script>

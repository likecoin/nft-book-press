<template>
  <SiteHeaderBase class="justify-between w-full px-5">
    <div class="flex items-center gap-2">
      <UButton
        v-if="isShowMenuToggle"
        class="lg:hidden"
        icon="i-heroicons-bars-3"
        size="lg"
        variant="ghost"
        @click="toggleSiteMenuOpen"
      />

      <h1 class="font-bold text-xl">
        {{ props.title }}
      </h1>
    </div>
  </SiteHeaderBase>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
const { toggleSiteMenuOpen } = useUIStore()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isShowMenuToggle: {
    type: Boolean,
    default: true
  }
})
</script>

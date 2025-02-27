<template>
  <div
    :class="[
      'flex',
      'justify-center',
      { 'w-[138px]': props.size === 'large' },
      { 'w-[80px]': props.size === 'small' },
      'mr-[16px]',
      'overflow-hidden'
    ]"
  >
    <img
      v-if="props.isImage"
      :class="[
        'w-full',
        'h-auto',
        'object-contain',
        'rounded-[8px]',
      ]"
      :src="props.fileData"
    >
    <UIcon v-else name="i-heroicons-document" class="text-dark-gray" />
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  isImage: { type: Boolean, default: false },
  fileData: { type: String, default: undefined },
  size: { type: String, default: 'large' }
})

</script>

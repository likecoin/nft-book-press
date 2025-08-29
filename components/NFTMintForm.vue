<template>
  <UForm :state="state" class="flex flex-col gap-[12px]">
    <UFormGroup
      :label="$t('form_labels.nft_mint_count')"
      class="text-left"
      :error="(state.mintCount === undefined || state.mintCount < 0) && $t('nft_mint_form.mint_count_greater_than_zero')"
    >
      <UInput
        v-model="state.mintCount"
        disabled
        type="number"
      />
    </UFormGroup>

    <UFormGroup
      :label="$t('form_labels.image_url')"
      name="imageUrl"
      class="text-left"
      :error="!state.imageUrl && $t('nft_mint_form.image_url_required')"
      required
    >
      <UInput v-model="state.imageUrl" :placeholder="$t('nft_mint_form.ipfs_placeholder')" />

      <div v-if="state.imageUrl && imagePreviewUrl" class="flex justify-center mt-3">
        <img
          :src="imagePreviewUrl"
          alt="Cover preview"
          class="max-w-[200px] max-h-[200px] object-contain rounded-lg border border-gray-200"
          @error="onImageError"
        >
      </div>
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
import { ARWEAVE_ENDPOINT } from '~/constant'

const { t: $t } = useI18n()

interface NFTMintFormState {
  mintCount: number
  imageUrl: string
  externalUrl: string
  maxSupply?: number
}

const props = defineProps<{
  modelValue: NFTMintFormState
  maxSupply?: number
  showMaxSupply?: boolean
}>()

const emit = defineEmits<{(
  e: 'update:modelValue', value: NFTMintFormState
): void }>()

const state = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const imagePreviewUrl = computed(() => {
  if (!state.value.imageUrl) {
    return null
  }

  const url = state.value.imageUrl
  if (url.startsWith('ar://')) {
    return `${ARWEAVE_ENDPOINT}/${url.replace('ar://', '')}`
  }

  if (url.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${url.replace('ipfs://', '')}`
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  return null
})

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

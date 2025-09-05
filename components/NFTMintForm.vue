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
    </UFormGroup>
  </UForm>
</template>

<script setup lang="ts">
interface NFTMintFormState {
  mintCount: number
  imageUrl: string
  externalUrl: string
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
</script>

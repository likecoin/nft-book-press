<template>
  <UForm :state="state" class="flex flex-col gap-[12px]">
    <UFormGroup
      :label="$t('form_labels.nft_mint_count')"
      class="text-left"
      :error="(state.mintCount === undefined || state.mintCount < 0) && $t('nft_mint_form.mint_count_greater_than_zero')"
      required
    >
      <UInput
        v-model="state.mintCount"
        placeholder="0-100"
        type="number"
        :min="0"
        :max="maxSupply"
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

    <div class="flex justify-center items-center">
      <h3 class="font-bold font-mono text-[14px]">
        {{ $t('form.advanced_settings') }}
      </h3>
      <UButton
        color="gray"
        variant="ghost"
        :icon="shouldShowAdvanceSettings ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        @click="shouldShowAdvanceSettings = !shouldShowAdvanceSettings"
      />
    </div>

    <template v-if="shouldShowAdvanceSettings">
      <UFormGroup :label="$t('form_labels.external_url')">
        <UInput v-model="state.externalUrl" placeholder="https://" />
      </UFormGroup>

      <UFormGroup v-if="showMaxSupply" :label="$t('form_labels.max_supply')">
        <template v-if="state.maxSupply && state.maxSupply < state.mintCount" #help>
          <UAlert
            class="mt-1"
            icon="i-heroicons-exclamation-triangle"
            :title="$t('nft_mint_form.more_than_mint_count')"
            color="red"
            variant="subtle"
          />
        </template>
        <UInput
          v-model="state.maxSupply"
          type="number"
          :min="state.mintCount"
          :placeholder="`> ${state.mintCount}`"
        />
      </UFormGroup>
    </template>
  </UForm>
</template>

<script setup lang="ts">
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
const shouldShowAdvanceSettings = ref(false)
</script>

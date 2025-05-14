<template>
  <UForm :state="state" class="flex flex-col gap-[12px]">
    <UFormGroup
      label="NFT ID Prefix / 前綴（書本編號）"
      class="text-left"
      :error="!whitespaceRegex.test(state.prefix) && 'NFT ID cannot contain spaces'"
      required
    >
      <UInput v-model="state.prefix" placeholder="English only ex.MoneyVerse" />
    </UFormGroup>

    <UFormGroup
      label="Number of NFT to mint / 鑄造數量（此批）"
      class="text-left"
      :error="(!state.mintCount || state.mintCount <= 0) && 'Mint count must be greater than 0'"
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
      label="Image URL / 封面網址"
      name="imageUrl"
      class="text-left"
      :error="!state.imageUrl && 'Image URL is required'"
      required
    >
      <UInput v-model="state.imageUrl" placeholder="ipfs:// ... or ar://...." />
    </UFormGroup>

    <div class="flex justify-center items-center">
      <h3 class="font-bold font-mono text-[14px]">
        Advanced Settings
      </h3>
      <UButton
        color="gray"
        variant="ghost"
        :icon="shouldShowAdvanceSettings ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        @click="shouldShowAdvanceSettings = !shouldShowAdvanceSettings"
      />
    </div>

    <template v-if="shouldShowAdvanceSettings">
      <UFormGroup label="External URL (optional) / 外部網址（選填）">
        <UInput v-model="state.externalUrl" placeholder="https://" />
      </UFormGroup>

      <UFormGroup label="URI (optional) / 元資料網址（選填）">
        <UInput v-model="state.uri" placeholder="https://" />
      </UFormGroup>

      <UFormGroup v-if="showMaxSupply" label="Max number of supply for this NFT Class (optional) / 最大供應量（選填）">
        <template v-if="state.maxSupply && state.maxSupply < state.mintCount" #help>
          <UAlert
            class="mt-1"
            icon="i-heroicons-exclamation-triangle"
            title="Should be more than number of NFT to mint"
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

interface NFTMintFormState {
  prefix: string
  mintCount: number
  imageUrl: string
  externalUrl: string
  uri: string
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
const whitespaceRegex = /^[a-zA-Z][a-zA-Z0-9/:-]{2,100}$/
</script>

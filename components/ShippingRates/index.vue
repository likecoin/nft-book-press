<template>
  <UCard :ui="{ body: { padding: '' } }">
    <template #header>
      <div class="flex flex-row justify-between items-center">
        <div class="flex justify-start items-center gap-[8px]">
          <h3 class="font-bold font-mono">
            Shipping Options
          </h3>
          <slot name="header" />
        </div>
        <UButton
          v-if="!shouldHideViewButtonOnViewMode"
          :icon="buttonConfig.icon"
          :label="buttonConfig.text"
          :loading="isLoading"
          @click="buttonConfig.action"
        />
      </div>
    </template>

    <UTable
      v-if="isEditMode"
      :columns="[
        { key: 'index' },
        { key: 'name', label: 'Name' },
        { key: 'price', label: 'Price (USD)' },
      ]"
      :rows="shippingRatesTableRows"
    >
      <template #name-data="{ row }">
        <div class="flex flex-col gap-[8px] items-start">
          <span class="text-center">en: {{ row.name.en }}</span>
          <span class="text-center">zh: {{ row.name.zh }}</span>
        </div>
      </template>
      <template #price-data="{ row }">
        <span class="text-center">{{ row.price }}</span>
      </template>
    </UTable>

    <div v-if="isViewMode" class="px-[24px] py-[12px]">
      <UFormGroup
        label="Physical Goods"
        :ui="{ label: { base: 'font-mono font-bold' } }"
      >
        <div class="flex flex-col gap-[16px]">
          <UCheckbox
            v-model="hasShipping"
            name="hasShipping"
            label="Includes physical good that requires shipping"
            :disabled="!shippingInfo.length"
          />
          <UAlert
            v-if="!shippingInfo.length"
            icon="i-heroicons-face-frown-solid"
            color="yellow"
            variant="solid"
            title="Please set the shipping options first to enable this feature."
          />
        </div>
      </UFormGroup>
    </div>
    <ShippingRatesInfoModal
      v-if="isShippingModalOpened"
      v-model="isShippingModalOpened"
      :read-only="readOnly"
      :shipping-info="shippingInfo"
      @on-update-shipping-rates="
        (value) => emit('on-update-shipping-rates', value)"
    />
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  shippingInfo: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Boolean
  },
  isNewListingPage: {
    type: Boolean,
    default: false
  }
})
const router = useRouter()
const emit = defineEmits(['update:modelValue', 'on-update-shipping-rates'])
const isShippingModalOpened = ref<Boolean>(false)

const hasShipping = ref(props.modelValue)
watch(() => props.modelValue, (newValue) => {
  hasShipping.value = newValue
})
watch(hasShipping, (hasShipping) => {
  emit('update:modelValue', hasShipping)
})
const isEditMode = computed(() => !(props.readOnly))
const isViewMode = computed(() => (props.readOnly))
const shouldHideViewButtonOnViewMode = computed(() => Boolean(isViewMode.value && props.isNewListingPage))
const buttonConfig = computed(() => {
  if (isEditMode.value && props.shippingInfo.length) {
    return {
      icon: 'i-heroicons-pencil-square',
      text: 'Edit',
      action: handleOpenShippingModal
    }
  } else if (isEditMode.value && !props.shippingInfo.length) {
    return {
      icon: 'i-heroicons-plus-20-solid',
      text: 'Add',
      action: handleOpenShippingModal
    }
  } else if (isViewMode.value && props.shippingInfo.length) {
    return {
      icon: 'i-heroicons-eye-20-solid',
      text: 'View Current Shipping Options',
      action: handleOpenShippingModal
    }
  } else if (isViewMode.value && !props.shippingInfo.length) {
    return {
      icon: 'i-heroicons-pencil-square-20-solid',
      text: 'Set Shipping Options',
      action: goBack
    }
  }
})
const shippingRatesTableRows = computed(() => {
  if (!props.shippingInfo.length) {
    return []
  }
  return props.shippingInfo.map((r: any, index: number) => ({
    index: index + 1,
    name: r.name,
    price: r.priceInDecimal / 100
  }))
})

function goBack () {
  router.go(-1) // go back to status page
}

function handleOpenShippingModal () {
  isShippingModalOpened.value = true
}
</script>

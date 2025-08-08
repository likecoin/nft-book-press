<template>
  <UCard :ui="{ body: { padding: '' } }">
    <template #header>
      <div class="flex flex-row justify-between items-center">
        <div class="flex justify-start items-center gap-[8px]">
          <h3 class="font-bold font-mono">
            {{ $t('form.shipping_options') }}
          </h3>
          <slot name="header" />
        </div>
        <UButton
          v-if="!shouldHideViewButtonOnViewMode"
          :icon="buttonConfig?.icon"
          :label="buttonConfig?.text"
          :loading="isLoading"
          @click="buttonConfig?.action"
        />
      </div>
    </template>

    <UTable
      v-if="isEditMode"
      :columns="[
        { key: 'index' },
        { key: 'name', label: $t('shipping_rates.name') },
        { key: 'price', label: $t('shipping_rates.price_usd') },
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

    <div v-else class="px-[24px] py-[12px]">
      <UFormGroup
        :label="$t('shipping_rates.physical_goods')"
        :ui="{ label: { base: 'font-mono font-bold' } }"
      >
        <div class="flex flex-col gap-[16px]">
          <UCheckbox
            v-model="hasShipping"
            name="hasShipping"
            :label="$t('shipping_rates.includes_physical_good')"
            :disabled="!shippingInfo.length"
          />
          <UAlert
            v-if="!shippingInfo.length"
            icon="i-heroicons-face-frown-solid"
            color="yellow"
            variant="solid"
            :title="$t('shipping_rates.enable_in_advanced_settings')"
          />
        </div>
      </UFormGroup>
    </div>
    <ShippingRatesInfoModal
      v-if="isShippingModalOpened"
      v-model="isShippingModalOpened"
      :read-only="isModalReadOnly"
      :shipping-info="shippingInfo"
      @update-shipping-rates="
        (value) => emit('update-shipping-rates', value)"
    />
  </UCard>
</template>

<script setup lang="ts">

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  isShowPhysicalGoodsCheckbox: {
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
  isShowSettingModalButton: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'update-shipping-rates'])
const isShippingModalOpened = ref(false)

const hasShipping = ref(props.modelValue)
const isModalReadOnly = ref(props.isShowPhysicalGoodsCheckbox)

watch(() => props.modelValue, (newValue) => {
  hasShipping.value = newValue
})
watch(hasShipping, (hasShipping) => {
  emit('update:modelValue', hasShipping)
})
const isEditMode = computed(() => !(props.isShowPhysicalGoodsCheckbox))
const isViewMode = computed(() => (props.isShowPhysicalGoodsCheckbox))
const shouldHideViewButtonOnViewMode = computed(() => Boolean(isViewMode.value && props.isShowSettingModalButton))
const buttonConfig = computed(() => {
  if (isEditMode.value) {
    if (props.shippingInfo.length) {
      return {
        icon: 'i-heroicons-pencil-square',
        text: $t('shipping_rates.edit'),
        action: handleOpenShippingModal
      }
    } else {
      return {
        icon: 'i-heroicons-plus-20-solid',
        text: $t('shipping_rates.add'),
        action: handleOpenShippingModal
      }
    }
  } else if (isViewMode.value) {
    if (props.shippingInfo.length) {
      return {
        icon: 'i-heroicons-eye-20-solid',
        text: $t('shipping_rates.view_current_options'),
        action: handleOpenShippingModal
      }
    } else {
      return {
        icon: 'i-heroicons-plus-20-solid',
        text: $t('shipping_rates.add_shipping_options'),
        action: handleOpenEditModal
      }
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

function handleOpenShippingModal () {
  isShippingModalOpened.value = true
}

function handleOpenEditModal () {
  isModalReadOnly.value = false
  isShippingModalOpened.value = true
}
</script>

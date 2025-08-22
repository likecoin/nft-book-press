<template>
  <UModal :model-value="modelValue">
    <UCard :ui="{ header: { base: 'font-bold font-mono' } }">
      <template #header>
        <div class="flex justify-between items-center">
          {{ modalTitle }}
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            @click="closeModal"
          />
        </div>
      </template>

      <component
        :is="hasMultipleShippingRates ? 'ul' : 'div'"
        v-if="shippingRates.length"
        class="space-y-4"
      >
        <component
          :is="hasMultipleShippingRates ? 'li' : 'div'"
          v-for="(s, index) in shippingRates"
          :key="s.index"
        >
          <UCard
            :ui="{
              body: { base: 'space-y-4' },
              footer: { base: 'flex justify-end items-center' },
            }"
          >
            <UFormGroup
              :label="$t('shipping_rates.name_of_option')"
              :ui="{ container: 'space-y-2' }"
            >
              <UInput
                :model-value="s.nameEn"
                :placeholder="$t('shipping_rates.shipping_option_name')"
                :disabled="isViewMode"
                @input="(e: InputEvent) => handleInputShippingRates(e, 'nameEn', index)"
              />
              <UInput
                :placeholder="$t('shipping_rates.shipping_option_name_zh')"
                :model-value="s.nameZh"
                :disabled="isViewMode"
                @input="(e: InputEvent) => handleInputShippingRates(e, 'nameZh', index)"
              />
            </UFormGroup>

            <UFormGroup :label="$t('shipping_rates.price_usd_of_option')">
              <UInput
                :model-value="s.price"
                type="number"
                step="0.01"
                :min="0"
                :disabled="isViewMode"
                @input="(e: InputEvent) => handleInputShippingRates(e, 'price', index)"
              />
            </UFormGroup>

            <template v-if="hasMultipleShippingRates && isEditMode" #footer>
              <UButton
                :label="$t('shipping_rates.delete')"
                variant="outline"
                color="red"
                @click="deleteShippingRate(index)"
              />
            </template>
          </UCard>
        </component>
        <div class="flex justify-center">
          <UButton
            v-if="isEditMode"
            :label="$t('shipping_rates.add_options')"
            variant="outline"
            icon="i-heroicons-plus-20-solid"
            @click="addMoreShippingRate"
          />
        </div>
      </component>
      <div v-else class="flex justify-center items-center w-full gap-[8px] py-[36px]">
        <span>
          {{ $t('shipping_rates.no_items') }}
        </span>
        <UButton
          v-if="isEditMode"
          :label="$t('shipping_rates.add_options')"
          variant="outline"
          icon="i-heroicons-plus-20-solid"
          @click="addMoreShippingRate"
        />
      </div>

      <template #footer>
        <div class="flex justify-end items-center">
          <UButton v-if="isEditMode" :label="$t('shipping_rates.save')" @click="handleOnSave" />
          <div v-else class="flex justify-end items-center">
            <UButton
              :label="$t('shipping_rates.set_shipping_options')"
              variant="outline"
              @click="updateShippingRates"
            >
              <template #trailing>
                <UIcon name="i-heroicons-arrow-right-20-solid" />
              </template>
            </UButton>
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

definePageMeta({ layout: 'page' })

const props = defineProps({
  modelValue: {
    type: Boolean
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  shippingInfo: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue', 'update-shipping-rates'])
const isEditMode = computed(() => !isReadOnlyMode.value)
const isViewMode = computed(() => isReadOnlyMode.value)
const modalTitle = computed(() =>
  isEditMode.value ? $t('shipping_rates.editing_shipping_options') : $t('shipping_rates.shipping_options_info')
)
const shippingRates = ref<any[]>(
  props.shippingInfo.length
    ? props.shippingInfo.map((option: any) => ({
      price: option.priceInDecimal / 100,
      nameEn: option.name?.en,
      nameZh: option.name?.zh
    }))
    : []
)
const hasMultipleShippingRates = computed(() => shippingRates.value.length > 1)
const isReadOnlyMode = ref(props.readOnly)

function closeModal () {
  emit('update:modelValue', false)
}

function updateShippingRates () {
  isReadOnlyMode.value = false
}

function handleInputShippingRates (e: InputEvent, key: string, index: number) {
  shippingRates.value[index][key] = (e.target as HTMLInputElement)?.value
}

function addMoreShippingRate () {
  if (!shippingRates.value.length) {
    shippingRates.value.push({
      index: uuidv4(),
      price: 10,
      nameEn: 'Standard Shipping',
      nameZh: '標準寄送'
    })
    return
  }
  shippingRates.value.push({
    index: uuidv4(),
    price: 20,
    nameEn: 'International Shipping',
    nameZh: '國際寄送'
  })
}

function deleteShippingRate (index: number) {
  shippingRates.value.splice(index, 1)
}

function handleOnSave () {
  emit('update-shipping-rates', shippingRates.value.map((option:any) => ({ name: { en: option.nameEn, zh: option.nameZh }, priceInDecimal: Math.round(Number(option.price) * 100) })))
  closeModal()
}
</script>

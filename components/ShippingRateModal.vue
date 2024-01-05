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

      <template v-if="isEditMode" #footer>
        <div class="flex justify-end items-center">
          <UButton
            label="Save"
            @click="closeModal"
          />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

definePageMeta({ layout: 'page' })

type ModeType = 'edit' | 'view'
const props = defineProps({
  modelValue: {
    type: Boolean
  },
  mode: {
    type: String as PropType<ModeType>,
    default: ''
  },
  shippingInfo: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])
const isEditMode = computed(() => !!(props.mode === 'edit'))
const modalTitle = computed(() => isEditMode.value ? 'Editing Shipping Options' : 'Shipping Options Info')
const shippingRates = ref<any[]>(props.shippingInfo.length
  ? props.shippingInfo.map((option:any) => ({
    price: option.priceInDecimal / 100,
    nameEn: option.name?.en,
    nameZh: option.name?.zh
  }))
  : [{
      price: 10,
      nameEn: 'Standard Shipping',
      nameZh: '標準寄送'
    }])
const hasMultipleShippingRates = computed(() => shippingRates.value.length > 1)

function closeModal () {
  emit('update:modelValue', false)
}

function updateShippingRate (e: InputEvent, key: string, index: number) {
  shippingRates.value[index][key] = (e.target as HTMLInputElement)?.value
}

function addMoreShippingRate () {
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
</script>

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
              label="Name of this shipping option"
              :ui="{ container: 'space-y-2' }"
            >
              <UInput
                :value="s.nameEn"
                placeholder="Shipping option name"
                @input="(e) => updateShippingRate(e, 'nameEn', index)"
              />
              <UInput
                placeholder="運送選項名稱"
                :value="s.nameZh"
                @input="(e) => updateShippingRate(e, 'nameZh', index)"
              />
            </UFormGroup>

            <UFormGroup label="Price(USD) of this shipping option">
              <UInput
                :value="s.price"
                type="number"
                step="0.01"
                :min="0"
                @input="(e) => updateShippingRate(e, 'price', index)"
              />
            </UFormGroup>

            <template v-if="hasMultipleShippingRates" #footer>
              <UButton
                label="Delete"
                variant="outline"
                color="red"
                @click="deleteShippingRate(index)"
              />
            </template>
          </UCard>
        </component>
        <UButton
          label="Add Option"
          variant="outline"
          @click="addMoreShippingRate"
        />
      </component>
      <div v-else class="flex justify-center items-center py-[36px]">
        No items
        <UButton
          label="Add Option"
          variant="outline"
          @click="addMoreShippingRate"
        />
      </div>

      <template v-if="isEditMode" #footer>
        <div class="flex justify-end items-center">
          <UButton label="Save" @click="closeModal" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

definePageMeta({ layout: 'page' })

type ModeType = 'edit' | 'view';
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
const modalTitle = computed(() =>
  isEditMode.value ? 'Editing Shipping Options' : 'Shipping Options Info'
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

function closeModal () {
  emit('update:modelValue', false)
}

function updateShippingRate (e: InputEvent, key: string, index: number) {
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
</script>

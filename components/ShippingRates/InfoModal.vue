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
                :disabled="isViewMode"
                @input="(e) => updateShippingRate(e, 'nameEn', index)"
              />
              <UInput
                placeholder="運送選項名稱"
                :value="s.nameZh"
                :disabled="isViewMode"
                @input="(e) => updateShippingRate(e, 'nameZh', index)"
              />
            </UFormGroup>

            <UFormGroup label="Price(USD) of this shipping option">
              <UInput
                :value="s.price"
                type="number"
                step="0.01"
                :min="0"
                :disabled="isViewMode"
                @input="(e) => updateShippingRate(e, 'price', index)"
              />
            </UFormGroup>

            <template v-if="hasMultipleShippingRates && isEditMode" #footer>
              <UButton
                label="Delete"
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
            label="Add Options"
            variant="outline"
            icon="i-heroicons-plus-20-solid"
            @click="addMoreShippingRate"
          />
        </div>
      </component>
      <div v-else class="flex justify-center items-center py-[36px]">
        No items
        <UButton
          v-if="isEditMode"
          label="Add Options"
          variant="outline"
          icon="i-heroicons-plus-20-solid"
          @click="addMoreShippingRate"
        />
      </div>

      <template #footer>
        <div class="flex justify-end items-center">
          <UButton v-if="isEditMode" label="Save" @click="closeModal" />
          <div v-if="isViewMode" class="flex justify-end items-center gap-[8px]">
            <span class="text-gray-300 text-sm text-right underline">
              You can manage the shipping options by going to the management page
            </span>
            <UButton
              label="Set Shipping Options"
              variant="outline"
              @click="addMoreShippingRate"
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

type ModeType = 'edit' | 'view';
const props = defineProps({
  modelValue: {
    type: Boolean
  },
  mode: {
    type: String as PropType<ModeType>,
    default: 'edit'
  },
  shippingInfo: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['update:modelValue'])
const isEditMode = computed(() => !!(props.mode === 'edit'))
const isViewMode = computed(() => !!(props.mode === 'view'))
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

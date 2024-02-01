<template>
  <UModal v-model="isModalOpen">
    <UCard
      :ui="{
        body: { base: 'space-y-4' },
        footer: { base: 'flex justify-end gap-2' }
      }"
    >
      <template #header>
        <h3 class="font-bold font-mono">
          New Coupon
        </h3>
      </template>

      <UFormGroup label="Coupon Code">
        <UInput
          v-model="coupon.id"
          placeholder="coupon_code"
          :ui="{ base: 'font-mono' }"
        />
      </UFormGroup>
      <UFormGroup
        label="Discount Multiplier"
        description="Between 0.01x and 1x"
      >
        <div class="flex gap-4 items-center">
          <URange
            v-model="couponDiscount"
            :step="5"
          />
          <UInput
            v-model="coupon.discount"
            type="number"
            :step="0.01"
            :min="0.01"
            :max="1.0"
            :ui="{ base: 'min-w-[80px] text-right' }"
          />
        </div>

        <template #help>
          <ul class="flex gap-1">
            <li v-for="({ label, value }) in discountShortcuts" :key="label">
              <UButton
                :label="label"
                :color="couponDiscount === value ? 'primary' : 'gray'"
                size="2xs"
                @click="couponDiscount = value "
              />
            </li>
          </ul>
        </template>
      </UFormGroup>

      <UFormGroup label="Expiry Date">
        <UInput
          v-model="coupon.expireTs"
          type="date"
        />
      </UFormGroup>

      <template #footer>
        <UButton
          label="Cancel"
          color="gray"
          @click="isModalOpen = false"
        />
        <UButton
          label="Add"
          :disabled="!(coupon.id && coupon.discount)"
          @click="handleClickAddButton"
        />
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const props = defineProps<{
  modelValue: boolean
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', isOpen: boolean): void
  (e: 'add', coupon: {
    id: string
    discount: number
    expireTs: number | null
  }): void
}>()

const isModalOpen = computed({
  get () {
    return !!route.query.new_coupon
  },
  set (value) {
    emit('update:modelValue', value)

    router.replace({
      query: {
        ...route.query,
        new_coupon: value ? '1' : undefined
      }
    })
  }
})

const coupon = ref({
  id: '',
  discount: 1.0,
  expireTs: ''
})

const discountShortcuts = [50, 70, 80, 85, 90, 95].map(value => ({ label: `${100 - value}%`, value }))

const couponDiscount = computed({
  get () {
    return coupon.value.discount * 100
  },
  set (value) {
    coupon.value.discount = value / 100
  }
})

watch(() => props.modelValue, (isOpen) => {
  isModalOpen.value = isOpen
  if (isOpen) {
    coupon.value = {
      id: '',
      discount: 1.0,
      expireTs: ''
    }
  }
}, { immediate: true })

function handleClickAddButton () {
  isModalOpen.value = false
  emit('add', {
    ...coupon.value,
    expireTs: coupon.value.expireTs ? new Date(coupon.value.expireTs).getTime() : null
  })
}
</script>

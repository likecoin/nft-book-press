<template>
  <UCard
    :ui="{
      divide: isStripeConnectChecked ? undefined : '',
      header: { base: 'flex flex-wrap justify-between items-center gap-2' },
      body: {
        padding: isStripeConnectChecked ? undefined : '',
      },
    }"
  >
    <template #header>
      <h3 class="font-bold font-mono">
        Connect to a Stripe Account
      </h3>
      <UToggle
        v-model="isStripeConnectChecked"
        name="stripe"
        label="Use a Stripe Connect account for receiving payments"
      />
    </template>

    <template v-if="isStripeConnectChecked">
      <div class="flex flex-col gap-[24px]">
        <div class="grid grid-cols-2 gap-[8px] w-full">
          <div class="flex flex-col w-full">
            <URadio
              v-model="isUsingDefaultAccount"
              class="w-[50%]"
              :value="true"
              :disabled="!!props.shouldDisableSetting"
            >
              <template #label>
                <div>Use my account</div>
              </template>
            </URadio>
            <div
              v-if="isDefaultAccountReady"
              class="flex flex-col items-start w-full"
            >
              <div
                class="flex flex-col gap-[8px] mt-[12px] px-[6px] py-[4px] w-[80%]"
              >
                <UAlert
                  icon="i-heroicons-check"
                  color="primary"
                  variant="outline"
                  title="Has Stripe Account"
                />
                <div>{{ ` Email: ${props.stripeConnectStatusWalletMap[props.loginAddress]?.email}` }}</div>
              </div>
            </div>
            <span v-else>
              <UButton
                class="mt-2"
                label="Create one here"
                :to="{ name: 'nft-book-store-user' }"
                target="_blank"
                variant="outline"
              />
            </span>
          </div>

          <div class="flex flex-col w-full">
            <URadio
              v-model="isUsingDefaultAccount"
              :value="false"
              :disabled="!!props.shouldDisableSetting"
            >
              <template #label>
                <span>Use another Stripe Express account</span>
              </template>
            </URadio>
            <div class="flex flex-col mt-[14px] w-[80%]">
              <UInput
                :value="inputWallet"
                :color="stripeConnectInputError ? 'rose' : 'white'"
                class="font-mono w-full"
                placeholder="like1..."
                @input="onStripeConnectWalletInput"
              />
              <span
                v-if="stripeConnectInputError"
                class="text-red-700 text-[10px]"
              >{{ stripeConnectInputError }}</span>
            </div>
            <UProgress v-if="isStripeConnectLoading" class="my-[6px]" animation="carousel" />
            <div
              v-else-if="
                connectStatusByInputWallet
              "
              class="flex flex-col gap-[8px] mt-[12px] px-[6px] py-[4px] w-[80%]"
            >
              <div
                v-if="isInputAccountReady"
              >
                <UAlert
                  icon="i-heroicons-check"
                  color="primary"
                  variant="outline"
                  title="Has Stripe Account"
                />
                <span
                  v-if="
                    connectStatusByInputWallet
                      ?.email
                  "
                >{{
                  ` Email: ${connectStatusByInputWallet?.email}`
                }}</span>
              </div>
              <UAlert
                v-else
                icon="i-heroicons-x-mark"
                color="red"
                variant="outline"
                title="No stripe account connected to this wallet yet."
              />
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center gap-[8px] w-full">
          <UButton
            label="Save Changes"
            :loading="isUpdatingStripeAccount"
            :color="isStripeConnectWalletReadyToSave ? 'primary' : 'gray'"
            :disabled="
              !isStripeConnectWalletReadyToSave || !!props.shouldDisableSetting
            "
            @click="handleSaveStripeConnectWallet"
          />
          <div
            v-if="!!props.shouldDisableSetting"
            class="text-center text-green-800 text-[12px]"
          >
            Successfully save the Stripe Connect account!
          </div>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { LIKE_ADDRESS_REGEX, LIKE_CO_API } from '~/constant'
import { useStripeStore } from '~/stores/stripe'

const stripeStore = useStripeStore()

const { fetchStripeConnectStatus } = stripeStore
const isStripeConnectChecked = defineModel('isStripeConnectChecked')
const isUsingDefaultAccount = defineModel('isUsingDefaultAccount')

const props = defineProps({
  loginAddress: {
    type: String,
    default: ''
  },
  shouldDisableSetting: {
    type: Boolean,
    default: false
  },
  stripeConnectStatusWalletMap: {
    type: Object,
    default: () => {}
  },
  stripeConnectWallet: {
    type: String,
    default: ''
  },
  isUpdatingStripeAccount: {
    type: Boolean,
    default: false
  }
})

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'save', wallet: string | undefined): void;
}>()

const inputWallet = ref('')
const stripeConnectInputError = ref('')
const isStripeConnectLoading = ref(false)
const isDefaultAccountReady = computed(() => props.stripeConnectStatusWalletMap[props.loginAddress]?.isReady)
const isInputAccountReady = computed(() => props.stripeConnectStatusWalletMap[inputWallet.value]?.isReady)

const isStripeConnectWalletReadyToSave = computed(() => {
  if (!isStripeConnectChecked.value) { return false }
  if (isUsingDefaultAccount.value && !isDefaultAccountReady.value) { return false }
  if ((!isUsingDefaultAccount.value && !isInputAccountReady.value) || stripeConnectInputError.value) { return false }
  return true
})

const connectStatusByInputWallet = computed(() => props.stripeConnectStatusWalletMap[inputWallet.value])

watch(() => props.stripeConnectWallet, (wallet) => {
  if (wallet && !isUsingDefaultAccount.value) {
    inputWallet.value = wallet
  }
}, { immediate: true })

async function onStripeConnectWalletInput (input: any) {
  if (!isStripeConnectChecked.value) { return }
  const inputValue = input.target.value.trim()
  inputWallet.value = inputValue
  stripeConnectInputError.value = ''

  if (!LIKE_ADDRESS_REGEX.test(inputValue)) {
    stripeConnectInputError.value = 'You have entered an invalid wallet address'
    return
  }
  if (props.stripeConnectStatusWalletMap[inputValue]) {
    return props.stripeConnectStatusWalletMap[inputValue]
  }

  isStripeConnectLoading.value = true
  try {
    await useFetch(
      `${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${inputValue}`
    )
    await fetchStripeConnectStatus(inputValue)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  } finally {
    isStripeConnectLoading.value = false
  }
}

function handleSaveStripeConnectWallet () {
  const wallet = isUsingDefaultAccount.value ? props.loginAddress : inputWallet.value
  emit('save', wallet)
}

</script>

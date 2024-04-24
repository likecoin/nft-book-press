<template>
  <UCard
    :ui="{
      divide: modelIsStripeConnectChecked ? undefined : '',
      header: { base: 'flex flex-wrap justify-between items-center gap-2' },
      body: {
        padding: modelIsStripeConnectChecked ? undefined : '',
      },
    }"
  >
    <template #header>
      <h3 class="font-bold font-mono">
        Connect to a Stripe Account
      </h3>
      <UToggle
        v-model="modelIsStripeConnectChecked"
        name="stripe"
        label="Use a Stripe Connect account for receiving all payment"
      />
    </template>

    <template v-if="modelIsStripeConnectChecked">
      <div class="flex flex-col gap-[24px]">
        <div class="flex items-start justify-start gap-[8px] w-full">
          <URadio
            v-model="modelIsUsingDefaultAccount"
            class="w-[50%]"
            :value="true"
            :disabled="!!props.shouldDisableSetting"
          >
            <template #label>
              <div>Use my account</div>
              <div
                v-if="isDefaultAccountReady"
                class="flex flex-col items-start"
              >
                <div
                  class="flex flex-col gap-[8px] mt-[12px] px-[6px] py-[4px]"
                >
                  <div>✅ Has Stripe Account</div>
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
            </template>
          </URadio>
          <URadio
            v-model="modelIsUsingDefaultAccount"
            :value="false"
            :disabled="!!props.shouldDisableSetting"
            class="w-[50%]"
          >
            <template #label>
              <span>Use another Stripe Express account</span>
              <div class="flex flex-col my-[10px]">
                <UInput
                  :value="inputWallet"
                  :color="stripeConnectInputError ? 'rose' : 'white'"
                  class="font-mon w-full"
                  placeholder="like1..."
                  @input="onStripeConnectWalletInput"
                />
                <span
                  v-if="stripeConnectInputError"
                  class="text-red-700 text-[10px]"
                >{{ stripeConnectInputError }}</span>
              </div>
              <div v-if="isStripeConnectLoading" class="text-center">
                Loading ...
              </div>
              <div
                v-else-if="
                  props.stripeConnectStatusWalletMap[inputWallet]
                "
                class="flex flex-col gap-[8px] mt-[12px] px-[6px] py-[4px]"
              >
                <div
                  v-if="isInputAccountReady"
                >
                  <span> ✅ Has Stripe Account</span><br>
                  <span
                    v-if="
                      props.stripeConnectStatusWalletMap[inputWallet]
                        ?.email
                    "
                  >{{
                    ` Email: ${props.stripeConnectStatusWalletMap[inputWallet]?.email}`
                  }}</span>
                </div>
                <div v-else>
                  ❌ No stripe account connected to this wallet yet.<br>
                </div>
              </div>
            </template>
          </URadio>
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

const props = defineProps({
  loginAddress: {
    type: String,
    default: ''
  },
  isStripeConnectChecked: {
    type: Boolean,
    default: false
  },
  isUsingDefaultAccount: {
    type: Boolean,
    default: true
  },
  shouldDisableSetting: {
    type: String,
    default: ''
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
  (e: 'update-is-stripe-connect-checked', isChecked: boolean): void;
  (e: 'update-is-using-default-account', isUsingDefaultAccount: boolean): void;
  (e: 'save', wallet: string | undefined): void;
}>()

const inputWallet = ref('')
const stripeConnectInputError = ref('')
const isStripeConnectLoading = ref(false)

const modelIsStripeConnectChecked = computed({
  get: () => props.isStripeConnectChecked,
  set: value => emit('update-is-stripe-connect-checked', value)
})

const modelIsUsingDefaultAccount = computed({
  get: () => props.isUsingDefaultAccount,
  set: value => emit('update-is-using-default-account', value)
})

const isDefaultAccountReady = computed(() => props.stripeConnectStatusWalletMap[props.loginAddress]?.isReady)
const isInputAccountReady = computed(() => props.stripeConnectStatusWalletMap[inputWallet.value]?.isReady)

const isStripeConnectWalletReadyToSave = computed(() => {
  if (!modelIsStripeConnectChecked.value) { return false }
  if (modelIsUsingDefaultAccount.value && !isDefaultAccountReady.value) { return false }
  if ((!modelIsUsingDefaultAccount.value && !isInputAccountReady.value) || stripeConnectInputError.value) { return false }
  return true
})

watch(() => props.stripeConnectWallet, (wallet) => {
  if (wallet && !props.isUsingDefaultAccount) {
    inputWallet.value = wallet
  }
}, { immediate: true })

async function onStripeConnectWalletInput (input: any) {
  if (!modelIsStripeConnectChecked.value) { return }
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
  const wallet = modelIsUsingDefaultAccount.value ? props.loginAddress : inputWallet.value
  emit('save', wallet)
}

</script>

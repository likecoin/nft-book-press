<template>
  <PageBody>
    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />

    <UAlert
      v-if="!isStripeConnectReady"
      icon="i-heroicons-exclamation-circle"
      color="orange"
      variant="soft"
      title="You need to have a Stripe Express account to use the auto-payout service of Liker Land Bookstore."
      description="A Stripe Express account is separated from any full-featured Stripe account. If you have a full-featured Stripe account, you must also register again here to create a Stripe Express account under Liker Land."
    />

    <template v-if="bookStoreApiStore.isAuthenticated">
      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          footer: { base: 'text-center' },
        }"
      >
        <template #header>
          <h1 class="text-center font-bold font-mono">
            Book Affiliation Program
          </h1>
          <UTooltip
            text="Refresh Liker ID"
            :popper="{ placement: 'left' }"
          >
            <UButton
              icon="i-heroicons-arrow-path"
              variant="outline"
              :disabled="isFetchingUserLikerInfo"
              @click="refreshUserLikerInfo"
            />
          </utooltip>
        </template>

        <UFormGroup v-if="userLikerInfo?.user" label="Your affiliation channel ID" size="xl">
          <UInput placeholder="Affiliation ID" :value="channelId" disabled />
          <template v-if="!isStripeConnectReady" #help>
            Please setup your stripe account below to participate in the book affiliation program.
          </template>
          <template v-else #help>
            Append <UKbd class="font-mono">
              ?from={{ channelId }}
            </UKbd> in any bookstore page to earn commission from book sales.
          </template>
        </UFormGroup>

        <p v-else>
          You have not setup your channel ID yet.
        </p>
        <template v-if="!userLikerInfo?.user" #footer>
          <UButton
            label="Setup your ID"
            size="lg"
            rel="noopener"
            target="_blank"
            :to="`${LIKE_CO_HOST}/in/register`"
          />
        </template>
      </UCard>
      <UCard
        :ui="{
          header: { base: 'flex justify-between items-center' },
          body: { padding: '' },
          footer: { base: 'text-center' },
        }"
      >
        <template #header>
          <h1 class="text-center font-bold font-mono">
            Stripe Connect Status
          </h1>

          <UTooltip
            text="Refresh Status"
            :popper="{ placement: 'left' }"
          >
            <UButton
              icon="i-heroicons-arrow-path"
              variant="outline"
              :disabled="isLoading"
              @click="refreshStripeConnectStatus"
            />
          </UTooltip>
        </template>

        <UTable
          :columns="[
            { key: 'initiated', label: 'Setup Initiated' },
            { key: 'completed', label: 'Setup Completed' }
          ]"
          :rows="[{
            initiated: connectStatus?.hasAccount || false,
            completed: isStripeConnectReady || false
          }]"
          :ui="{ th: { base: 'text-center' }, td: { base: 'text-center' } }"
        >
          <template #initiated-data="{ row }">
            <UBadge v-if="row.initiated" label="Yes" color="green" variant="outline" />
            <UBadge v-else label="No" color="red" variant="outline" />
          </template>
          <template #completed-data="{ row }">
            <UBadge v-if="row.completed" :label="connectStatus?.notificationEmail || 'Yes'" color="green" variant="outline" />
            <UBadge v-else label="No" color="red" variant="outline" />
          </template>
        </UTable>

        <template #footer>
          <UButton
            v-if="isLoading"
            label="Loading"
            size="lg"
            :loading="true"
            @click="onLoginToStripe"
          />
          <UButton
            v-else-if="isStripeConnectReady"
            label="Login to Stripe account"
            size="lg"
            @click="onLoginToStripe"
          />
          <UButton
            v-else-if="!userLikerInfo?.user"
            label="Liker ID is required"
            size="lg"
            rel="noopener"
            target="_blank"
            :to="`${LIKE_CO_HOST}/in/register`"
          />
          <UButton
            v-else
            label="Setup Stripe Payment Recipient Account"
            size="lg"
            @click="onSetupStripe"
          />
        </template>
      </UCard>

      <template v-if="isStripeConnectReady">
        <UCard
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { base: 'flex flex-col gap-6' },
            footer: { base: 'text-center' },
          }"
        >
          <template #header>
            <h1 class="text-center font-bold font-mono">
              User Setting
            </h1>
          </template>

          <UFormGroup label="Liker ID Email">
            <UInput
              :value="bookUser?.notificationEmail"
              label="Liker ID Email"
              disabled
              :ui="{ base: 'font-mono' }"
            >
              <template v-if="bookUser?.notificationEmail" #trailing>
                <UBadge
                  v-if="bookUser?.isEmailVerified"
                  label="Verified"
                  color="green"
                  size="xs"
                  :ui="{ rounded: 'rounded-full' }"
                />
                <UBadge
                  v-else
                  label="Unverified"
                  color="amber"
                  variant="outline"
                  size="xs"
                  :ui="{ rounded: 'rounded-full' }"
                />
              </template>
            </UInput>
          </UFormGroup>

          <UFormGroup label="Email Notification Settings">
            <div class="flex items-center gap-2">
              <UToggle
                v-if="isAllowChangingNotificationEmailSettings"
                v-model="isEnableNotificationEmails"
              />
              <UToggle v-else :model-value="false" :disabled="true" />

              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                Receive email notifications about commissions
              </span>
            </div>

            <template v-if="!bookUser?.notificationEmail || !bookUser?.isEmailVerified" #help>
              <UAlert
                v-if="!bookUser?.notificationEmail"
                icon="i-heroicons-exclamation-circle"
                color="orange"
                variant="subtle"
                title="Email is not setup yet."
                description="To enable email notifications, please setup your Liker ID email."
              />
              <UAlert
                v-else-if="!bookUser?.isEmailVerified"
                icon="i-heroicons-exclamation-circle"
                color="orange"
                variant="subtle"
                title="Email is not verified."
                description="To enable email notifications, please verify your Liker ID email."
              />
            </template>
          </UFormGroup>

          <template v-if="isAllowChangingNotificationEmailSettings" #footer>
            <UButton
              label="Update"
              :disabled="bookUser?.isEnableNotificationEmails === isEnableNotificationEmails"
              :loading="isUpdatingBookUserProfile"
              @click="updateUserProfile"
            />
          </template>
        </UCard>
        <UCard
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { padding: '' },
            footer: { base: 'text-center' },
          }"
        >
          <template #header>
            <h1 class="text-center font-bold font-mono">
              Book Sales Commission History
            </h1>

            <UTooltip
              text="Refresh Status"
              :popper="{ placement: 'left' }"
            >
              <UButton
                icon="i-heroicons-arrow-path"
                variant="outline"
                :disabled="isLoading"
                @click="loadCommissionHistory"
              />
            </UTooltip>
          </template>

          <UTable
            :columns="[
              { key: 'timestamp', label: 'Timestamp' },
              { key: 'type', label: 'Commission Type' },
              { key: 'amount', label: 'Commission' },
              { key: 'classId', label: 'Book Id' },
              { key: 'collectionId', label: 'Book Collection Id' },
              { key: 'currency', label: 'Currency' },
              { key: 'amountTotal', label: 'Sale Amount' },
            ]"
            :rows="commissionHistoryRows"
            :ui="{ th: { base: 'text-center' }, td: { base: 'text-center' } }"
          >
            <template #classId-data="{ row }">
              <a :href="`${LIKER_LAND_URL}/nft/class/${row.classId}`" target="_blank">
                {{ nftStore.getClassMetadataById(row.classId)?.name }}
              </a>
            </template>
            <template #collectionId-data="{ row }">
              <a :href="`${LIKER_LAND_URL}/nft/collection/${row.collectionId}`" target="_blank">
                {{ collectionStore.getCollectionById(row.collectionId)?.name?.zh
                  || collectionStore.getCollectionById(row.collectionId)?.name?.en }}
              </a>
            </template>
          </UTable>
        </UCard>
        <UCard
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { padding: '' },
            footer: { base: 'text-center' },
          }"
        >
          <template #header>
            <h1 class="text-center font-bold font-mono">
              Commission Payout History
            </h1>

            <UTooltip
              text="Refresh Status"
              :popper="{ placement: 'left' }"
            >
              <UButton
                icon="i-heroicons-arrow-path"
                variant="outline"
                :disabled="isLoading"
                @click="loadPayoutHistory"
              />
            </UTooltip>
          </template>

          <UTable
            :columns="[
              { key: 'createdTs', label: 'Created' },
              { key: 'amount', label: 'Payout Amount' },
              { key: 'status', label: 'Status' },
              { key: 'arrivalTs', label: 'Arrived' },
              { key: 'details', label: 'Payout Details' },
            ]"
            :rows="payoutHistoryRows"
            :ui="{ th: { base: 'text-center' }, td: { base: 'text-center' } }"
          >
            <template #details-data="{ row }">
              <UButton
                label="Details"
                size="sm"
                color="gray"
                :to="{
                  name: 'nft-book-store-user-payouts-payoutId',
                  params: {
                    payoutId: row.id
                  }
                }"
              />
            </template>
          </UTable>
        </UCard>
      </template>
    </template>
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'

const { LIKER_LAND_URL, LIKE_CO_API, LIKE_CO_HOST } = useRuntimeConfig().public

const nftStore = useNftStore()
const bookStoreApiStore = useBookStoreApiStore()
const collectionStore = useCollectionStore()
const userStore = useUserStore()
const { token, wallet } = storeToRefs(bookStoreApiStore)
const { bookUser, isUpdatingBookUserProfile, userLikerInfo, isFetchingUserLikerInfo } = storeToRefs(userStore)
const toast = useToast()

const error = ref('')
const isLoading = ref(false)
const connectStatus = ref<any>({})
const commissionHistory = ref<any>([])
const payoutHistory = ref<any>([])
const isEnableNotificationEmails = ref(true)

const channelId = computed(() => {
  if (userLikerInfo.value?.user) {
    return convertLikerIdToChannelId(userLikerInfo.value?.user)
  }
  return ''
})

watch(bookUser, (user) => {
  isEnableNotificationEmails.value = user?.isEnableNotificationEmails || false
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

const isAllowChangingNotificationEmailSettings = computed(() =>
  !!(bookUser.value?.notificationEmail && bookUser.value?.isEmailVerified)
)

onMounted(async () => {
  await Promise.all([
    loadCommissionHistory(),
    refreshUserLikerInfo(),
    refreshStripeConnectStatus(),
    userStore.lazyFetchBookUserProfile()
  ])
  if (isStripeConnectReady.value) { await loadPayoutHistory() }
})

const isStripeConnectReady = computed(() => connectStatus.value?.isReady)

const commissionHistoryRows = computed(() => {
  return commissionHistory.value.map((row: any) => {
    let type = row.type
    switch (type) {
      case 'connectedWallet':
        type = 'royalties'
        break
      case 'channelCommission':
        type = 'channel'
        break
    }
    return {
      ...row,
      type,
      amount: formatNumberWithCurrency(row.amount, row.currency),
      amountTotal: formatNumberWithCurrency(row.amountTotal, row.currency),
      currency: formatCurrency(row.currency),
      timestamp: new Date(row.timestamp).toLocaleString()
    }
  })
})

const payoutHistoryRows = computed(() => {
  return payoutHistory.value.map((row: any) => {
    const {
      id,
      amount,
      currency,
      status,
      arrivalTs,
      createdTs
    } = row
    return {
      id,
      amount: formatNumberWithCurrency(amount, currency),
      status,
      createdTs: new Date(createdTs * 1000).toLocaleString(),
      arrivalTs: arrivalTs ? new Date(arrivalTs * 1000).toLocaleString() : ''
    }
  })
})

async function loadCommissionHistory () {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/commissions/list`, {
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    if (fetchError.value && fetchError.value?.statusCode !== 404) {
      throw new Error(fetchError.value.toString())
    }
    commissionHistory.value = (data.value as any)?.commissions || []

    const classIds = new Set<string>(commissionHistory.value
      .filter((row: any) => row.classId)
      .map((row: any) => row.classId))
    classIds.forEach((classId: string) => nftStore.lazyFetchClassMetadataById(classId))

    const collectionIds = new Set<string>(commissionHistory.value
      .filter((row: any) => row.collectionId)
      .map((row: any) => row.collectionId))
    collectionIds.forEach((collectionId: string) => collectionStore.lazyFetchCollectionById(collectionId))
  } catch (e) {
    console.error(e)
    error.value = (e as Error).toString()
  } finally {
    isLoading.value = false
  }
}

async function loadPayoutHistory () {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/payouts/list`, {
      headers: {
        authorization: `Bearer ${token.value}`
      }
    })
    if (fetchError.value && fetchError.value?.statusCode !== 404) {
      throw new Error(fetchError.value.toString())
    }
    payoutHistory.value = (data.value as any)?.payouts || []
  } catch (e) {
    console.error(e)
    error.value = (e as Error).toString()
  } finally {
    isLoading.value = false
  }
}

async function refreshUserLikerInfo () {
  try {
    await userStore.fetchUserLikerInfo({ nocache: true })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    error.value = (e as Error).toString()
  }
}

async function refreshStripeConnectStatus () {
  try {
    await loadStripeConnectStatus()

    if (connectStatus.value?.hasAccount && !isStripeConnectReady.value) {
      const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/refresh`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${token.value}`
          }
        }
      )
      if (fetchError.value && fetchError.value?.statusCode !== 404) {
        throw new Error(fetchError.value.toString())
      }
      if ((data.value as any).isReady) {
        connectStatus.value.isReady = true
        await loadStripeConnectStatus()
      }
    }
  } catch (e) {
    console.error(e)
    error.value = (e as Error).toString()
  } finally {
    isLoading.value = false
  }
}

async function loadStripeConnectStatus () {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/status?wallet=${wallet.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    if (fetchError.value && fetchError.value?.statusCode !== 404) {
      throw new Error(fetchError.value.toString())
    }
    connectStatus.value = (data.value as any) || {}
  } catch (e) {
    console.error(e)
    error.value = (e as Error).toString()
  } finally {
    isLoading.value = false
  }
}

async function onLoginToStripe () {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/login`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    if (fetchError.value) {
      throw new Error(fetchError.value.toString())
    }
    const url = (data.value as any).url
    if (url) {
      window.open(url)
    } else {
      throw new Error('CANNOT_GET_STRIPE_CONNECT_RUL')
    }
  } catch (e) {
    console.error(e)
    error.value = e.toString()
  } finally {
    isLoading.value = false
  }
}

async function onSetupStripe () {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/user/connect/new`,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token.value}`
        }
      }
    )
    if (fetchError.value) {
      throw new Error(fetchError.value.toString())
    }
    const url = (data.value as any).url
    if (url) {
      window.open(url)
    } else {
      throw new Error('CANNOT_GET_STRIPE_CONNECT_RUL')
    }
  } catch (e) {
    console.error(e)
    error.value = e.toString()
  } finally {
    isLoading.value = false
  }
}

async function updateUserProfile () {
  if (!isAllowChangingNotificationEmailSettings.value) {
    return
  }

  try {
    await userStore.updateBookUserProfile({
      isEnableNotificationEmails: isEnableNotificationEmails.value
    })
    toast.add({
      icon: 'i-heroicons-check-circle',
      title: 'User profile updated'
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    toast.add({
      icon: 'i-heroicons-exclamation-circle',
      title: 'Unable to update user profile',
      description: (e as Error).toString(),
      timeout: 0,
      color: 'red',
      ui: {
        title: 'text-red-400 dark:text-red-400'
      }
    })
  }
}

</script>

<template>
  <main class="space-y-4">
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
      v-if="!connectStatus?.isReady"
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
          body: { padding: '' },
          footer: { base: 'text-center' },
        }"
      >
        <template #header>
          <h1 class="text-center font-bold font-mono">
            Book Affiliation Program
          </h1>
        </template>
        <div v-if="likerIdInfo?.user">
          <h2>
            Your affiliation channel ID
          </h2>
          <code class="text-center font-bold font-mono">
            @{{ likerIdInfo?.user }}
          </code>
          <p v-if="!connectStatus.isReady">
            Please setup your stripe account below to participate in the book affiliation program.
          </p>
          <p v-else>
            Append <code class="font-bold font-mono">?from=@{{ likerIdInfo?.user }}</code> in any book store page to earn commission from book sales.
          </p>
        </div>
        <p v-else>
          You have not setup your channel ID yet.
        </p>
        <template #footer>
          <UButton
            v-if="!likerIdInfo?.user"
            label="Setup your ID"
            size="lg"
            rel="noopener"
            target="_blank"
            :to="`${LIKE_CO_HOST}/in`"
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
              @click="loadStripeConnectStatus"
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
            completed: connectStatus?.isReady || false
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
            v-else-if="connectStatus?.isReady"
            label="Login to Stripe account"
            size="lg"
            @click="onLoginToStripe"
          />
          <UButton
            v-else
            label="Setup Stripe Payment Recipient Account"
            size="lg"
            @click="onSetupStripe"
          />
        </template>
      </UCard>

      <template v-if="connectStatus?.isReady">
        <UCard
          :ui="{
            header: { base: 'flex justify-between items-center' },
            body: { padding: '' },
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
            />
          </UFormGroup>
          <UFormGroup label="Is Liker ID Email verified">
            <UCheckbox
              :value="bookUser?.isEmailVerified"
              :checked="bookUser?.notificationEmail"
              label="Is Liker ID Email verified"
              disabled
              :ui="{ base: 'font-mono' }"
            />
          </UFormGroup>
          <UFormGroup label="Email Notification Settings">
            <UAlert
              v-if="!(bookUser?.notificationEmail && bookUser?.isEmailVerified)"
              icon="i-heroicons-exclamation-circle"
              color="orange"
              variant="soft"
              title="Please setup email in Liker ID."
              description="To enable email notifications, setup and verify your Liker ID email"
            />

            <UCheckbox
              v-model="isEnableNotificationEmails"
              name="isEnalbeNotificationEmails"
              label="Enable email notifications about commissions"
              :disabled="!(bookUser?.notificationEmail && bookUser?.isEmailVerified)"
            />
          </UFormGroup>
          <template #footer>
            <UButton
              label="Update"
              color="gray"
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
                {{ collectionStore.getCollectionById(row.collectionId)?.name }}
              </a>
            </template>
          </UTable>
        </UCard>
      </template>
    </template>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useWalletStore } from '~/stores/wallet'
import { useNftStore } from '~/stores/nft'
import { useCollectionStore } from '~/stores/collection'
import { LIKER_LAND_URL, LIKE_CO_API, LIKE_CO_HOST } from '~/constant'

const nftStore = useNftStore()
const walletStore = useWalletStore()
const bookStoreApiStore = useBookStoreApiStore()
const collectionStore = useCollectionStore()
const userStore = useUserStore()
const { wallet } = storeToRefs(walletStore)
const { token } = storeToRefs(bookStoreApiStore)
const { bookUser } = storeToRefs(userStore)

const error = ref('')
const isLoading = ref(false)
const connectStatus = ref<any>({})
const likerIdInfo = ref<any>({})
const commissionHistory = ref<any>([])
const isEnableNotificationEmails = ref(true)

watch(bookUser, (user) => {
  isEnableNotificationEmails.value = user?.isEnableNotificationEmails || false
})

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

onMounted(async () => {
  await Promise.all([
    loadCommissionHistory(),
    loadLikerId(),
    loadStripeConnectStatus(),
    userStore.lazyFetchBookUserProfile()
  ])
})

const commissionHistoryRows = computed(() => {
  return commissionHistory.value.map((row: any) => {
    return {
      ...row,
      amount: `${row.currency}${row.amount / 100}`,
      amountTotal: `${row.currency}${row.amountTotal / 100}`,
      timestamp: new Date(row.timestamp).toLocaleString()
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

async function loadLikerId () {
  try {
    isLoading.value = true
    const { data, error: fetchError } = await useFetch(`${LIKE_CO_API}/users/addr/${wallet.value}/min`)
    if (fetchError.value && fetchError.value?.statusCode !== 404) {
      throw new Error(fetchError.value.toString())
    }
    likerIdInfo.value = (data.value as any) || {}
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
  await userStore.updateBookUserProfile({
    isEnableNotificationEmails: isEnableNotificationEmails.value
  })
}

</script>

<template>
  <PageBody>
    <h1 class="text-lg font-bold font-mono">
      Gift NFT Book "{{ nftClassName || classId }}"
    </h1>

    <UFormGroup label="Gift edition" :required="true">
      <USelect v-model="priceIndex" :options="priceIndexOptions" />
    </UFormGroup>

    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="`${error}`"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', padded: false }"
      @close="error = ''"
    />

    <UProgress v-if="isLoading" animation="carousel">
      <template #indicator>
        Loading...
      </template>
    </UProgress>

    <UCard
      v-if="bookStoreApiStore.isAuthenticated"
      :ui="{
        body: { base: 'space-y-4' },
        footer: { base: 'flex justify-center gap-2' }
      }"
    >
      <UFormGroup label="Default Recipient Name" :required="true">
        <UTextarea v-model="defaultToName" placeholder="Fellow Reader" />
      </UFormGroup>

      <UFormGroup label="Default Gift Message" :required="true">
        <UTextarea v-model="defaultMessage" placeholder="Thank you for your support" />
      </UFormGroup>

      <UFormGroup label="Gift Giver’s Name" :required="true">
        <UTextarea v-model="defaultFromName" placeholder="Your name" />
      </UFormGroup>

      <UFormGroup>
        <template #label>
          Upload Recipient List CSV file (<UButton
            label="Download CSV Template"
            variant="link"
            :padded="false"
            size="xs"
            @click="downloadTemplateCSV"
          />)
        </template>
        <UInput class="mt-1" type="file" accept=".csv" @change="onReceiverFileChange" />
      </UFormGroup>

      <UCard
        :ui="{
          header: { base: 'flex gap-4 items-center' },
          body: { padding: '' },
        }"
      >
        <template #header>
          <h2 class="text-lg font-bold font-mono">
            Recipients
          </h2>
          <UBadge :label="`${receiverCount}`" :ui="{ rounded: 'rounded-full' }" />
        </template>
        <UTable
          :columns="tableColumns"
          :rows="receiverList"
        />
      </UCard>

      <template #footer>
        <UButton label="Confirm" :disabled="!isAllFieldsFilled" size="xl" @click="onSendGift" />
      </template>
    </UCard>
  </PageBody>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

import { downloadBlob } from '~/utils'
import { useBookStoreApiStore } from '~/stores/book-store-api'
import { useNftStore } from '~/stores/nft'

const { LIKE_CO_API } = useRuntimeConfig().public

const bookStoreApiStore = useBookStoreApiStore()
const { token } = storeToRefs(bookStoreApiStore)

const nftStore = useNftStore()
const { lazyFetchClassMetadataById } = nftStore

const route = useRoute()
const router = useRouter()

const error = ref('')
const isLoading = ref(false)
const classId = ref(route.params.classId as string)

const classListingInfo = ref<any>({})
const prices = ref<any[]>([])
const priceIndex = ref(0)

const priceIndexOptions = computed(() => classListingInfo.value.prices?.map((p: any, index: number) => ({
  label: `${p.name.en || p.name} - $${p.price}`,
  value: index,
  disabled: index === priceIndex.value
})))

const defaultToName = ref('')
const defaultFromName = ref('')
const defaultMessage = ref('')

const isAllFieldsFilled = computed(() => !!defaultToName.value && !!defaultFromName.value && !!defaultMessage.value && !!receiverList.value.length)

const receiverList = ref<any>([])
const receiverCount = computed(() => receiverList.value?.length || 0)

const nftClassName = computed(() => nftStore.getClassMetadataById(classId.value as string)?.name)

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

const csvColumns = ['wallet', 'email', 'toName', 'message']
const tableColumns = [
  {
    label: 'Email (required)',
    key: 'email'
  },
  {
    label: 'Wallet (optional)',
    key: 'wallet'
  },
  {
    label: 'Recipient name (optional)',
    key: 'toName'
  },
  {
    label: 'Message (optional)',
    key: 'message'
  }
]

onMounted(async () => {
  isLoading.value = true
  try {
    const { data: classData, error: classFetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/store/${classId.value}`,
      {
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
    if (classFetchError.value) {
      throw classFetchError.value
    }
    classListingInfo.value = classData.value
    prices.value = classListingInfo.value.prices
    lazyFetchClassMetadataById(classId.value as string)
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
})

function downloadTemplateCSV () {
  downloadBlob(
    stringify([csvColumns.reduce((obj, key) => {
      obj[key] = ''
      return obj
    }, {} as any)], { header: true }),
    'gift_list.csv',
    'text/csv;charset=utf-8;'
  )
}

function onReceiverFileChange (files: FileList) {
  if (!files) { return }
  const [file] = files
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const text = e.target?.result
      if (typeof text !== 'string') { return }
      const data = parse(text, { columns: true })
      receiverList.value = data
    } catch (err) {
      console.error(err)
      error.value = (err as Error).toString()
    }
  }
  reader.readAsText(file)
}

async function onSendGift () {
  if (!isAllFieldsFilled.value) { return }
  try {
    isLoading.value = true
    const { error: fetchError } = await useFetch(`${LIKE_CO_API}/likernft/book/store/class/${classId.value}/price/${priceIndex.value}/gift`,
      {
        method: 'POST',
        body: {
          receivers: receiverList.value,
          giftInfo: {
            toName: defaultToName.value,
            fromName: defaultFromName.value,
            message: defaultMessage.value
          }
        },
        headers: {
          authorization: `Bearer ${token.value}`
        }
      })
    if (fetchError.value) {
      throw fetchError.value
    }
    router.push({
      name: 'nft-book-store-status-classId',
      params: {
        classId: classId.value
      }
    })
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

</script>

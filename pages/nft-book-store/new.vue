<template>
  <div>
    <h1>New NFT Book Listing</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="bookStoreApiStore.isAuthenticated">
      <p><label>NFT Class ID:</label></p>
      <input v-model="classIdInput" placeholder="likenft....">
      <p>Total number of NFT for sale: {{ totalStock }}</p>
      <hr>
      <div v-for="p, index in prices" :key="index">
        <p><label>Price(USD) per NFT Book (Minimal ${{MINIMAL_PRICE}})</label></p>
        <input :value="p.price" type="number" :min="MINIMAL_PRICE" @input="e => updatePrice(e, 'price', index)">
        <p><label>Total number of NFT for sale at this price</label></p>
        <input :value="p.stock" type="number" @input="e => updatePrice(e, 'stock', index)">
        <p><label>Product name of this price</label></p>
        <input :value="p.name" @input="e => updatePrice(e, 'name', index)">
        <hr>
      </div>
      <button @click="addMorePrice">Add more prices</button>
      <p><label>Share sales data to wallets:</label></p>
      <ul>
        <li v-for="m, i in moderatorWallets" :key="m">
          {{ m }}<button style="margin-left: 4px" @click="() => moderatorWallets.splice(i, 1)">x</button>
        </li>
      </ul>
      <input v-model="moderatorWalletInput" placeholder="like1..."><button style="margin-left: 4px" @click="addModeratorWallet">Add</button>
      <p><label>Email to receive sales notifications</label></p>
      <ul>
        <li v-for="e, i in notificationEmails" :key="e">
          {{ e }}<button style="margin-left: 4px" @click="() => notificationEmails.splice(i, 1)">x</button>
        </li>
      </ul>
      <input v-model="notificationEmailInput"><button @click="addNotificationEmail">Add</button>
      <hr>
      <button :disabled="isLoading" @click="onSubmit">
        Submit
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useBookStoreApiStore } from '~/stores/book-store-api'

const bookStoreApiStore = useBookStoreApiStore()
const { newBookListing } = bookStoreApiStore
const router = useRouter()
const route = useRoute()

const MINIMAL_PRICE = 5

const error = ref('')
const isLoading = ref(false)

const classIdInput = ref(route.query.class_id as string || '')
const prices = ref<any[]>([{
  price: 0,
  stock: Number(route.query.count as string || 0),
  name: 'Standard Edition'
}])
const moderatorWallets = ref<string[]>([])
const notificationEmails = ref<string[]>([])
const moderatorWalletInput = ref('')
const notificationEmailInput = ref('')
const totalStock = computed(() => prices.value.reduce((acc, p) => acc + Number(p.stock), 0))

watch(isLoading, (newIsLoading) => {
  if (newIsLoading) { error.value = '' }
})

function updatePrice (e: InputEvent, key: string, index: number) {
  prices.value[index][key] = (e.target as HTMLInputElement)?.value
}

function addMorePrice () {
  prices.value.push({ price: 0, stock: 0, name: `Tier ${prices.value.length}` })
}

function addModeratorWallet () {
  moderatorWallets.value.push(moderatorWalletInput.value)
}

function addNotificationEmail () {
  notificationEmails.value.push(notificationEmailInput.value)
}

async function onSubmit () {
  try {
    if (!classIdInput.value) {
      throw new Error('Please input NFT class ID')
    }
    isLoading.value = true
    const p = prices.value
      .filter(p => p.price > 0)
      .map(p => ({
        name: p.name,
        priceInDecimal: Number(p.price) * 100,
        price: Number(p.price),
        stock: Number(p.stock)
      }))
    await newBookListing(classIdInput.value, {
      moderatorWallets,
      notificationEmails,
      prices: p
    })
    router.push({ name: 'nft-book-store' })
  } catch (err) {
    const errorData = (err as any).data || err
    console.error(errorData)
    error.value = errorData
  } finally {
    isLoading.value = false
  }
}

</script>

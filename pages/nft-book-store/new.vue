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
        <p><label>Price(USD) per NFT Book</label></p>
        <input :value="p.price" type="number" @input="e => updatePrice(e, 'price', index)">
        <p><label>Total number of NFT for sale at this price</label></p>
        <input :value="p.stock" type="number" :min="MINIMAL_PRICE" @input="e => updatePrice(e, 'stock', index)">
        <p><label>Product name of this price</label></p>
        <input :value="p.name" @input="e => updatePrice(e, 'name', index)">
        <hr>
      </div>
      <button @click="addMorePrice">Add more prices</button>
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

async function onSubmit () {
  try {
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
      prices: p
    })
    router.push({ name: 'nft-book-store' })
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

</script>

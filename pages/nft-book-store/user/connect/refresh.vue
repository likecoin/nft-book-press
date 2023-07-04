<template>
  <div>
    <h1>Stripe connect returned</h1>
    <div>
      Some unexpected issue happened, please go back to connect status page and try again
      <NuxtLink :to="{ name: 'nft-book-store-user-connect' }">
        Go back
      </NuxtLink>
    </div>
  </div>
</template>

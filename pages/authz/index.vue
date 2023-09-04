<template>
  <div>
    <h1>Send NFT Authz Grants management page</h1>
    <div v-if="error" style="color: red">
      {{ error }}
    </div>
    <div v-if="isLoading" style="color: green">
      Loading...
    </div>
    <hr>
    <section v-if="!wallet">
      <h2>Connect your wallet</h2>
      <div>
        <button :disabled="isLoading" @click="onClickConnect">
          Connect
        </button>
      </div>
    </section>
    <template v-else>
      <h2>*Warning*</h2>
      <p style="color: red">
        Granting other wallet send NFT authz permission allows them to send away *ANY* NFT you own, not limited to NFT books or NFT you created.
      </p>
      <p style="color: red">
        Use with CAUTION and ONLY grant to those you absolutely trust!
      </p>
      <hr>
      <h2>Current grants</h2>
      <table>
        <thead>
          <tr>
            <th>Wallet</th>
            <th>Expiration</th>
            <th>Renew</th>
            <th>Revoke</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="grant in grants" :key="grant.grantee">
            <td>{{ grant.grantee }}</td>
            <td>{{ new Date(grant.expiration.seconds.toNumber() * 1000) }}</td>
            <td>
              <button @click="onClickRenewGrant(grant.grantee)">
                Renew
              </button>
            </td>
            <td>
              <button @click="onClickRevokeGrant(grant.grantee)">
                Revoke
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <hr>
      <h2>Grant new send NFT authz</h2>
      <input v-model="newGrantee" placeholder="like1...">
      <button :disabled="isLoading" @click="onNewGrant()">
        Submit
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWalletStore } from '~/stores/wallet'
import {
  getNFTAuthzGranterGrants,
  signGrantNFTSendAuthz,
  signRevokeNFTSendAuthz
} from '~/utils/cosmos'

const walletStore = useWalletStore()
const { wallet, signer } = storeToRefs(walletStore)
const { connect } = walletStore
const route = useRoute()

const error = ref('')
const newGrantee = ref(route.query.grantee as string || '')
const grants = ref([] as any)
const isLoading = ref(false)

watch(wallet, async (wallet) => {
  if (wallet) {
    error.value = ''
    try {
      await fetchAuthzGrants()
    } catch {}
    if (newGrantee.value && !grants.value.find(g => g.grantee === newGrantee.value)) {
      onNewGrant(newGrantee.value)
    }
  } else {
    grants.value = []
  }
}, { immediate: true })

async function fetchAuthzGrants () {
  const g = await getNFTAuthzGranterGrants(wallet.value)
  grants.value = g
}

async function onNewGrant (grantee = newGrantee.value) {
  try {
    error.value = ''
    isLoading.value = true
    if (!wallet.value || !signer.value) { throw new Error('NO_WALLET') }
    if (!grantee) { throw new Error('WALLET_INPUT_EMPTY') }
    const res = await signGrantNFTSendAuthz(grantee, signer.value, wallet.value)
    console.log(res)
    await fetchAuthzGrants()
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}
function onClickRenewGrant (grantee) {
  onNewGrant(grantee)
}

async function onClickRevokeGrant (grantee) {
  try {
    error.value = ''
    isLoading.value = true
    if (!wallet.value || !signer.value) { throw new Error('NO_WALLET') }
    if (!grantee) { throw new Error('WALLET_INPUT_EMPTY') }
    const res = await signRevokeNFTSendAuthz(grantee, signer.value, wallet.value)
    console.log(res)
    await fetchAuthzGrants()
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

async function onClickConnect () {
  try {
    error.value = ''
    isLoading.value = true
    if (!wallet.value) {
      await connect()
    }
    if (!wallet.value) { return }
  } catch (err) {
    console.error(err)
    error.value = (err as Error).toString()
  } finally {
    isLoading.value = false
  }
}

</script>
<style>
table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}
</style>

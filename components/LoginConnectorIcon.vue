<template>
  <img
    v-if="src"
    :src="src"
    :alt="`${connectorId} Icon`"
  >
  <span v-else />
</template>

<script setup lang="ts">
import brave from '~/assets/images/login-connectors/brave.svg?url'
import cosmostation from '~/assets/images/login-connectors/cosmostation.svg?url'
import keplr from '~/assets/images/login-connectors/keplr.svg?url'
import metamask from '~/assets/images/login-connectors/metamask.svg?url'
import rabby from '~/assets/images/login-connectors/rabby.svg?url'
import walletConnect from '~/assets/images/login-connectors/walletconnect.svg?url'

const props = defineProps<{
  connectorId: string
}>()

const src = computed(() => {
  switch (props.connectorId) {
    case 'com.brave.wallet':
      return brave
    case 'io.cosmostation':
      return cosmostation
    case 'app.keplr':
      return keplr
    case 'io.metamask':
      return metamask
    case 'io.rabby':
      return rabby
    case 'walletConnect':
      return walletConnect
    default:
      return ''
  }
})
</script>

import { WagmiPlugin } from '@wagmi/vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { defineNuxtPlugin } from 'nuxt/app'

import { createWagmiConfig } from '../utils/wagmi/config'

// NOTE: Possibly will move to @wagmi/vue/nuxt nitro plugin
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  nuxtApp.vueApp
    .use(WagmiPlugin, {
      config: createWagmiConfig({
        apiKey: config.public.MAGIC_LINK_API_KEY,
        chainId: config.public.MAGIC_LINK_CHAIN_ID,
        rpcURL: config.public.MAGIC_LINK_RPC_URL,
        isServer: !!nuxtApp.ssrContext
      })
    })
    .use(VueQueryPlugin, {})
})

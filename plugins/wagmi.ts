import { WagmiPlugin } from '@wagmi/vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { defineNuxtPlugin } from 'nuxt/app'
import type { Config } from '@wagmi/core'

import { createWagmiConfig } from '../utils/wagmi/config'

// NOTE: Possibly will move to @wagmi/vue/nuxt nitro plugin
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const wagmiConfig = createWagmiConfig({
    apiKey: config.public.MAGIC_LINK_API_KEY,
    isServer: !!nuxtApp.ssrContext,
    isTestnet: !!config.public.IS_TESTNET
  })

  nuxtApp.vueApp
    .use(WagmiPlugin, {
      config: wagmiConfig
    })
    .use(VueQueryPlugin, {})

  return {
    provide: {
      wagmiConfig
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $wagmiConfig: Config
  }
}

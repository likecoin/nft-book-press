import { http, createStorage, cookieStorage, createConfig } from '@wagmi/vue'
import { optimism, optimismSepolia } from '@wagmi/vue/chains'
import { injected } from '@wagmi/connectors'

export const config = createConfig({
  chains: [optimism, optimismSepolia],
  connectors: [
    injected()
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  transports: {
    [optimism.id]: http(),
    [optimismSepolia.id]: http()
  }
})

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}

import { http, createConfig } from '@wagmi/vue'
import { optimism, optimismSepolia } from '@wagmi/vue/chains'
import { injected, metaMask } from '@wagmi/vue/connectors'
import { dedicatedWalletConnector } from '@magiclabs/wagmi-connector'

let cachedConfig: ReturnType<typeof createConfig>

export function getConfig () {
  if (!cachedConfig) { throw new Error('Wagmi config not created yet. Call createWagmiConfig first.') }
  return cachedConfig
}

export function createWagmiConfig ({
  apiKey,
  rpcURL = '',
  chainId,
  customLogoURL,
  isServer = false
}: {
  apiKey: string
  rpcURL?: string
  chainId?: number
  customLogoURL?: string
  isServer?: boolean
}) {
  cachedConfig = createConfig({
    chains: [optimismSepolia, optimism],
    connectors: [
      // NOTE: @magiclabs/wagmi-connector is not compatible with SSR
      // https://github.com/magiclabs/wagmi-magic-connector/issues/42#issuecomment-2771613002
      ...(isServer
        ? []
        : [dedicatedWalletConnector({
            chains: [optimismSepolia, optimism],
            options: {
              apiKey,
              accentColor: '#131313',
              customHeaderText: '3ook.com',
              customLogo: customLogoURL,
              isDarkMode: false,
              magicSdkConfiguration: {
                network: {
                  rpcUrl: rpcURL,
                  chainId
                }
              }
            }
          })]),
      injected()
    ],
    ssr: true,
    transports: {
      [optimism.id]: http(),
      [optimismSepolia.id]: http()
    }
  })
  return cachedConfig
}

declare module '@wagmi/vue' {
  interface Register {
    config: ReturnType<typeof createWagmiConfig>
  }
}

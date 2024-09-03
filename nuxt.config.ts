import { nodePolyfills } from 'vite-plugin-node-polyfills'

const LikeCoinWalletConnectorCSSPath = '@likecoin/wallet-connector/dist/style.css'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    LikeCoinWalletConnectorCSSPath,
    '@/assets/styles/global.css'
  ],
  modules: [
    '@sentry/nuxt/module',
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@nuxt/ui',
    'nuxt-gtag'
  ],
  gtag: {
    id: 'G-815EFDL3PS'
  },
  plugins: ['~/plugins/buffer.ts'],
  vite: {
    plugins: [
      nodePolyfills()
    ],
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }
  },
  runtimeConfig: {
    public: {
      IS_TESTNET: process.env.IS_TESTNET,

      SITE_URL: process.env.SITE_URL,

      CHAIN_ID: process.env.CHAIN_ID,
      CHAIN_NAME: process.env.CHAIN_NAME,
      CHAIN_DENOM: process.env.CHAIN_DENOM,
      CHAIN_MINIMAL_DENOM: process.env.CHAIN_MINIMAL_DENOM,
      COINGECKO_ID: process.env.COINGECKO_ID,
      RPC_URL: process.env.RPC_URL,
      LCD_URL: process.env.LCD_URL,
      CHAIN_EXPLORER_URL: process.env.CHAIN_EXPLORER_URL,

      LIKER_NFT_FEE_WALLET: process.env.LIKER_NFT_FEE_WALLET,
      LIKER_NFT_TARGET_ADDRESS: process.env.LIKER_NFT_TARGET_ADDRESS,

      AUTHCORE_API_HOST: process.env.AUTHCORE_API_HOST,
      LIKER_LAND_URL: process.env.LIKER_LAND_URL,
      LIKE_CO_HOST: process.env.LIKE_CO_HOST,
      LIKE_CO_API: process.env.LIKE_CO_API,
      APP_LIKE_CO_URL: process.env.APP_LIKE_CO_URL,
      NFT_MARKETPLACE_URL: process.env.NFT_MARKETPLACE_URL,
      ISCN_TOOLS_URL: process.env.ISCN_TOOLS_URL
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'page', mode: 'out-in' }
  },
  colorMode: {
    preference: 'light'
  },
  tailwindcss: {
    injectPosition: { after: LikeCoinWalletConnectorCSSPath },
    cssPath: '~/assets/css/tailwind.css'
  }
})

import { nodePolyfills } from 'vite-plugin-node-polyfills'

const LikeCoinWalletConnectorCSSPath = '@likecoin/wallet-connector/dist/style.css'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    LikeCoinWalletConnectorCSSPath,
    '@/assets/styles/global.css'
  ],
  modules: [
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
      IS_TESTNET: process.env.IS_TESTNET || 'TRUE',

      SITE_URL: process.env.SITE_URL || 'https://likecoin-nft-book-press-testnet.netlify.app',

      CHAIN_ID: process.env.CHAIN_ID || 'likecoin-public-testnet-5',
      CHAIN_NAME: process.env.CHAIN_NAME || 'LikeCoin public test chain',
      CHAIN_DENOM: process.env.CHAIN_DENOM || 'EKIL',
      CHAIN_MINIMAL_DENOM: process.env.CHAIN_MINIMAL_DENOM || 'nanoekil',
      COINGECKO_ID: process.env.COINGECKO_ID || undefined,
      RPC_URL: process.env.RPC_URL || 'https://node.testnet.like.co/rpc/',
      LCD_URL: process.env.LCD_URL || 'https://node.testnet.like.co',
      CHAIN_EXPLORER_URL: process.env.CHAIN_EXPLORER_URL || 'https://node.testnet.like.co/cosmos/tx/v1beta1/txs',

      LIKER_NFT_FEE_WALLET: process.env.LIKER_NFT_FEE_WALLET || 'like1yney2cqn5qdrlc50yr5l53898ufdhxafqz9gxp',
      LIKER_NFT_TARGET_ADDRESS: process.env.LIKER_NFT_TARGET_ADDRESS || 'like1yney2cqn5qdrlc50yr5l53898ufdhxafqz9gxp',

      AUTHCORE_API_HOST: process.env.AUTHCORE_API_HOST || 'https://likecoin-integration-test.authcore.io',
      LIKER_LAND_URL: process.env.LIKER_LAND_URL || 'https://rinkeby.liker.land',
      LIKE_CO_HOST: process.env.LIKE_CO_HOST || 'https://rinkeby.like.co',
      LIKE_CO_API: process.env.LIKE_CO_API || 'https://api.rinkeby.like.co',
      APP_LIKE_CO_URL: process.env.APP_LIKE_CO_URL || 'https://app.rinkeby.like.co',
      NFT_MARKETPLACE_URL: process.env.NFT_MARKETPLACE_URL || 'https://likecoin-nft-marketplace-testnet.netlify.app',
      ISCN_TOOLS_URL: process.env.ISCN_TOOLS_URL || 'https://likecoin-iscn-nft-tools-testnet.netlify.app'
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

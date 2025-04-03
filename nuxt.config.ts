import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { replaceCodePlugin } from 'vite-plugin-replace'

const {
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  GA_TRACKING_ID
} = process.env

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    '@/assets/styles/global.css'
  ],

  modules: [
    '@sentry/nuxt/module',
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@nuxt/ui',
    'nuxt-gtag',
    'nuxt-security',
    '@nuxt/scripts'
  ],

  scripts: {
    registry: {
      crisp: true
    }
  },

  gtag: {
    id: GA_TRACKING_ID
  },

  sentry: {
    sourceMapsUploadOptions: SENTRY_AUTH_TOKEN
      ? {
          org: SENTRY_ORG,
          project: SENTRY_PROJECT,
          authToken: SENTRY_AUTH_TOKEN
        }
      : undefined
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginOpenerPolicy: 'same-origin-allow-popups',
      contentSecurityPolicy: {
        'script-src': [
          "'self'",
          'https:',
          "'unsafe-inline'",
          "'wasm-unsafe-eval'",
          "'nonce-{{nonce}}'",
          'https://l.crisp.chat'
        ],
        'worker-src': ["'self'", 'blob:'],
        'img-src': ["'self'", 'data:', '*']
      },
      referrerPolicy: 'strict-origin'
    },
    removeLoggers: false
  },

  alias: {
    // polyfill process
    process: path.resolve(__dirname, 'node_modules/unenv/runtime/node/process')
  },
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['eventemitter3']
    },
    plugins: [
      nodePolyfills({
        // global breaks on dev
        globals: {
          process: false,
          Buffer: false,
          global: false
        }
      }),
      // https://github.com/davidmyersdev/vite-plugin-node-polyfills/issues/92
      replaceCodePlugin({
        replacements: [
          {
            from: `if ((crypto && crypto.getRandomValues) || !process.browser) {
  exports.randomFill = randomFill
  exports.randomFillSync = randomFillSync
} else {
  exports.randomFill = oldBrowser
  exports.randomFillSync = oldBrowser
}`,
            to: `exports.randomFill = randomFill
exports.randomFillSync = randomFillSync`
          }
        ]
      })
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
      scripts: {
        crisp: {
          id: ''
        }
      },
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
      LIKE_CO_STATIC_ENDPOINT: process.env.LIKE_CO_STATIC_ENDPOINT,
      APP_LIKE_CO_URL: process.env.APP_LIKE_CO_URL,
      NFT_MARKETPLACE_URL: process.env.NFT_MARKETPLACE_URL,
      ISCN_TOOLS_URL: process.env.ISCN_TOOLS_URL,
      ARWEAVE_ENDPOINT: process.env.ARWEAVE_ENDPOINT,
      LIKECOIN_V3_BOOK_MIGRATION_SITE_URL: process.env.LIKECOIN_V3_BOOK_MIGRATION_SITE_URL
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
    cssPath: '~/assets/css/tailwind.css'
  },

  compatibilityDate: '2024-12-06'
})

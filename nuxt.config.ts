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

      CHAIN_EXPLORER_URL: process.env.CHAIN_EXPLORER_URL,
      OPENSEA_URL: process.env.OPENSEA_URL,

      LIKE_EVM_NFT_TARGET_ADDRESS: process.env.LIKE_EVM_NFT_TARGET_ADDRESS,

      MAGIC_LINK_API_KEY: process.env.MAGIC_LINK_API_KEY,
      MAGIC_LINK_CHAIN_ID: Number(process.env.MAGIC_LINK_CHAIN_ID) || 0,
      MAGIC_LINK_RPC_URL: process.env.MAGIC_LINK_RPC_URL,

      LIKE_NFT_CONTRACT_ADDRESS: process.env.LIKE_NFT_CONTRACT_ADDRESS as `0x${string}`,

      LIKER_LAND_URL: process.env.LIKER_LAND_URL,
      LIKE_CO_API: process.env.LIKE_CO_API,
      LIKE_CO_STATIC_ENDPOINT: process.env.LIKE_CO_STATIC_ENDPOINT,

      ARWEAVE_ENDPOINT: process.env.ARWEAVE_ENDPOINT,
      LIKECOIN_V3_BOOK_MIGRATION_SITE_URL: process.env.LIKECOIN_V3_BOOK_MIGRATION_SITE_URL,
      BOOK3_URL: process.env.BOOK3_URL
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

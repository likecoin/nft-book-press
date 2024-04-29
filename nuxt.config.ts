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

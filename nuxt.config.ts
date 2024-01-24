import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/styles/global.css'],
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
    ]
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'page', mode: 'out-in' }
  },
  colorMode: {
    preference: 'light'
  }
})

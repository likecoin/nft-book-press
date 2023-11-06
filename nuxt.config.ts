import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['@/assets/styles/global.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/eslint-module',
    '@nuxt/ui'
  ],
  plugins: ['~/plugins/buffer.ts'],
  vite: {
    plugins: [
      nodePolyfills()
    ]
  }
})

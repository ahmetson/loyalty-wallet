import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
  ],

  ssr: false,

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Web 3 Loyalty',
      short_name: 'Web3Loyalty',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
    workbox: {
      globPatterns: ['**/*.{js,css,png,svg,ico}'],
    },
  },

  hooks: {
    'components:dirs': (dirs) => {
      dirs.unshift({
        path: '~/components/ui',
        // this is required else Nuxt will autoImport `.ts` file
        extensions: ['.vue'],
        // prefix for your components, eg: UiButton
        prefix: 'Ui',
        // prevent adding another prefix component by it's path.
        pathPrefix: false,
      })
      dirs.unshift({
        path: '~/components/typography',
        // this is required else Nuxt will autoImport `.ts` file
        extensions: ['.vue'],
        // prefix for your components, eg: UiButton
        prefix: 'Text',
        // prevent adding another prefix component by it's path.
        pathPrefix: false,
      })
    },
  },

  colorMode: {
    classSuffix: '',
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Web3 Loyalty system' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  runtimeConfig: {
    // Private keys are only available on the server

    CIRCUITS_PATH: process.env.CIRCUITS_PATH,
    WALLET_KEY: process.env.WALLET_KEY,

    // Public keys that are exposed to the client
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080',
      RHS_URL: process.env.RHS_URL,
      CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
      LOYALTY_CONTRACT_ADDRESS: process.env.LOYALTY_CONTRACT_ADDRESS,
      POLYGON_RPC_URL: process.env.POLYGON_RPC_URL,
      ETH_RPC_URL: process.env.ETH_RPC_URL,
    },
  },

  vite: {
    resolve: {
      alias: {
        stream: 'stream-browserify',
        // process: 'process/browser',
        // util: 'util'
      },
    },
    plugins: [nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    })],
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
  },
})

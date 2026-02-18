// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',
  imports: {
    autoImport: false,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: '',
      socketUrl: '',
      uploadsUrl: '',
    },
  },
  icon: {
    serverBundle: 'remote',
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@vueuse/nuxt',
  ],
});

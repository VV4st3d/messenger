// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
    srcDir: "app/",
    imports: {
        autoImport: true,
    },
    runtimeConfig: {
        public: {
            apiBaseUrl: "",
            socketUrl: ""
        },
    },
    nitro: {
        experimental: {
            websocket: true,
        },
    },
    modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@pinia/nuxt"],
});

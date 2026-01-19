import { createAuthRepository } from "~/repository/auth";

export default defineNuxtPlugin({
  name: "fetch",
  parallel: true,
  setup(nuxtApp) {
    const config = useRuntimeConfig();
    const appFetch = $fetch.create({
      retry: false,
      baseURL: config.public.apiBaseUrl,
      onRequest({ request, options, error }) {
        options.headers.append("Accept", `application/json`);

        if (import.meta.browser) {
          const authToken = localStorage.getItem("AUTH_TOKEN");
          if (authToken) {
            options.headers.append("Authorization", `Bearer ${authToken}`);
          }
        }
      },
      async onResponseError({ response }) {
         if(response.status == 401){
          nuxtApp.runWithContext(() => navigateTo('/auth/login'));
        }
      },
    });

    const api = {
      auth: createAuthRepository(appFetch),
    };

    return {
      provide: {
        appFetch,
        api,
      },
    };
  },
});

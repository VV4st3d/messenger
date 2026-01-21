import { createAuthRepository } from "~/repository/auth";
import { createFriendsRepository } from "~/repository/friends";

export default defineNuxtPlugin({
  name: "fetch",
  parallel: true,
  setup(nuxtApp) {
    const config = useRuntimeConfig();
    const authStore = useAuthStore()
    const appFetch = $fetch.create({
      retry: false,
      baseURL: config.public.apiBaseUrl,
      onRequest({ request, options, error }) {
        options.headers.append("Accept", `application/json`);
        
        options.headers.append("Authorization", `Bearer ${authStore.token}`)
      },
      async onResponseError({ response }) {
         if(response.status == 401){
          nuxtApp.runWithContext(() => navigateTo('/auth'));
        }
      },
    });

    const api = {
      auth: createAuthRepository(appFetch),
      friend: createFriendsRepository(appFetch),
    };

    return {
      provide: {
        appFetch,
        api,
      },
    };
  },
});

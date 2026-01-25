import { defineNuxtPlugin, navigateTo, useRuntimeConfig } from '#app';
import { useAuthStore } from '#imports';
import { createAuthRepository } from '~/repository/auth';
import { createChatsRepository } from '~/repository/chats';
import { createFriendsRepository } from '~/repository/friends';
import { RouteNames } from '~/shared/const';

export default defineNuxtPlugin({
  name: 'fetch',
  parallel: true,
  setup(nuxtApp) {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const appFetch = $fetch.create({
      retry: false,
      baseURL: config.public.apiBaseUrl,
      onRequest({ request, options, error }) {
        options.headers.append('Accept', `application/json`);

        options.headers.append('Authorization', `Bearer ${authStore.token}`);
      },
      async onResponseError({ response }) {
        if (response.status == 401) {
          nuxtApp.runWithContext(() => navigateTo({ name: RouteNames.AUTH }));
        }
      },
    });

    const api = {
      auth: createAuthRepository(appFetch),
      friend: createFriendsRepository(appFetch),
      chats: createChatsRepository(appFetch),
    };

    return {
      provide: {
        appFetch,
        api,
      },
    };
  },
});

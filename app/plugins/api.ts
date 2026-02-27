import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { useAuthStore } from '#imports';
import { createAuthRepository } from '~/repository/auth';
import { createChatsRepository } from '~/repository/chats';
import { createFriendsRepository } from '~/repository/friends';
import { createProfileRepository } from '~/repository/profile';

export default defineNuxtPlugin({
  name: 'fetch',
  setup() {
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
          authStore.setUser(null);
        }
      },
    });

    const api = {
      auth: createAuthRepository(appFetch),
      friend: createFriendsRepository(appFetch),
      chats: createChatsRepository(appFetch),
      profile: createProfileRepository(appFetch),
    };

    return {
      provide: {
        appFetch,
        api,
      },
    };
  },
});

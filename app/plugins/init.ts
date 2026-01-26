import { defineNuxtPlugin, useAuthStore, useNuxtApp } from '#imports';
import { useRoute } from 'vue-router';
import { ROUTES } from '~/shared/const';

export default defineNuxtPlugin({
  name: 'init',
  parallel: true,
  dependsOn: ['fetch'],
  async setup() {
    const route = useRoute();
    if (route.path === ROUTES.getRouteAuth()) return;
    const { $api } = useNuxtApp();
    const authStore = useAuthStore();

    try {
      const response = await $api.auth.me();
      if (response.success) {
        authStore.setUser(response.data);
      } else {
        authStore.setUser(null);
      }
    } catch (e) {
      authStore.setUser(null);
      console.log(e);
    }
  },
});

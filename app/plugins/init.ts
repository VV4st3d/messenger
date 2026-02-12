import {
  defineNuxtPlugin,
  useAsyncData,
  useAuthStore,
  useNuxtApp,
} from '#imports';

export default defineNuxtPlugin({
  name: 'init',
  dependsOn: ['fetch'],
  async setup() {
    const { $api } = useNuxtApp();
    const authStore = useAuthStore();

    try {
      const { data } = await useAsyncData('user-init', () => $api.auth.me());

      if (!data.value?.success) {
        authStore.setUser(null);
        return;
      }
      authStore.setUser(data.value.data);

      if (!import.meta.client) {
        return;
      }

      const { $socket } = useNuxtApp();
      if ($socket) {
        $socket.connect();
      }
    } catch (e) {
      authStore.setUser(null);
      console.log(e);
    }
  },
});

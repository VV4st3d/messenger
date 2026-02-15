import { useAuthStore } from '#imports';

const authStore = useAuthStore();
export const contextEvents = [
  {
    label: 'Выход',
    callback: () => authStore.logout(),
  },
];

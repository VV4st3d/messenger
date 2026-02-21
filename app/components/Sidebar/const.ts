import { useAuthStore } from '#imports';

const authStore = useAuthStore();
export const contextEvents: { label: string; callback: () => void }[] = [
  {
    label: 'Выход',
    callback: () => authStore.logout(),
  },
];

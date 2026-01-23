import { computed, useAuthStore } from '#imports';

export function useAuth() {
  const authStore = useAuthStore();
  const isAuthenticated = computed(() => !!authStore.user);
  return {
    user: authStore.user,
    isAuthenticated,
  };
}

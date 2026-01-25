import { storeToRefs } from 'pinia';
import { computed, useAuthStore } from '#imports';

export function useAuth() {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    isAuthenticated,
  };
}

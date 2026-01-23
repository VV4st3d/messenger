import { useCookie } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IUser } from '~/shared/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null);
  const isOnline = ref<boolean | null>(null);
  const setUser = (payload: IUser | null) => (user.value = payload);

  const AUTH_TOKEN_COOKIE_NAME = 'AUTH_TOKEN';
  const AUTH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

  const token = useCookie(AUTH_TOKEN_COOKIE_NAME, {
    maxAge: AUTH_TOKEN_MAX_AGE,
    watch: true,
  });

  const setOnline = (payload: boolean) => {
    isOnline.value = payload;
  };

  return { user, setUser, token, setOnline, isOnline };
});

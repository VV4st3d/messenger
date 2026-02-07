import { useCookie, useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AUTH_TOKEN_COOKIE_NAME, AUTH_TOKEN_MAX_AGE } from '~/shared/const';
import type { ILoginBody, IRegisterBody, IUser } from '~/shared/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null);
  const isOnline = ref<boolean | null>(null);

  const token = useCookie(AUTH_TOKEN_COOKIE_NAME, {
    maxAge: AUTH_TOKEN_MAX_AGE,
    watch: true,
  });
  const setUser = (payload: IUser | null) => (user.value = payload);

  const setOnline = (payload: boolean) => {
    isOnline.value = payload;
  };

  const loginHandler = async (payload: ILoginBody): Promise<void> => {
    const { $api } = useNuxtApp();
    try {
      const { data, token: accessToken } = await $api.auth.login(payload);
      token.value = accessToken;
      setUser(data);
    } catch (error) {
      console.error('login error: ', error);
      throw error;
    }
  };

  const registerHandler = async (payload: IRegisterBody): Promise<void> => {
    const { $api } = useNuxtApp();
    try {
      const { data, token: accessToken } =
        await $api.auth.registration(payload);
      setUser(data);
      token.value = accessToken;
    } catch (error) {
      console.error('register error: ', error);
    }
  };

  return {
    user,
    token,
    setUser,
    setOnline,
    isOnline,
    loginHandler,
    registerHandler,
  };
});

import { useCookie, useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { AUTH_TOKEN_COOKIE_NAME, AUTH_TOKEN_MAX_AGE } from '~/shared/const';
import type { ILoginBody, IRegisterBody, IUser } from '~/shared/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<IUser | null>(null);
  const isOnline = ref<boolean | null>(null);
  const setUser = (payload: IUser | null) => (user.value = payload);

  const { $api } = useNuxtApp();

  const token = useCookie(AUTH_TOKEN_COOKIE_NAME, {
    maxAge: AUTH_TOKEN_MAX_AGE,
    watch: true,
  });

  const setOnline = (payload: boolean) => {
    isOnline.value = payload;
  };

  const loginHandler = async (payload: ILoginBody) => {
    try {
      const { data, token: responseToken } = await $api.auth.login(payload);
      token.value = responseToken;
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const registerHandler = async (payload: IRegisterBody) => {
    try {
      const { data, token: responseToken } =
        await $api.auth.registration(payload);
      setUser(data);
      token.value = responseToken;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    user,
    setUser,
    token,
    setOnline,
    isOnline,
    loginHandler,
    registerHandler,
  };
});

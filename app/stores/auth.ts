import { navigateTo, useCookie, useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_TOKEN_MAX_AGE,
  RouteNames,
} from '~/shared/const';
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

  const login = async (payload: ILoginBody): Promise<void> => {
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

  const rigester = async (payload: IRegisterBody): Promise<void> => {
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

  const logout = () => {
    user.value = null;
    token.value = null;
    return navigateTo({ name: RouteNames.AUTH });
  };

  return {
    user,
    token,
    setUser,
    setOnline,
    isOnline,
    login,
    rigester,
    logout,
  };
});

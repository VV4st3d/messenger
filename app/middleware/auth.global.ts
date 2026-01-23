import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '#imports';
import { RouteNames, getRouteAuth } from '@/shared/const';

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const authStore = useAuthStore();

  if (!authStore.user && to.path !== getRouteAuth())
    return navigateTo({ name: RouteNames.AUTH });
  else if (authStore.user && to.path === getRouteAuth())
    return navigateTo({ name: RouteNames.MAIN });
});

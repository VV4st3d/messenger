import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { useAuthStore } from '#imports';
import { RouteNames, ROUTES } from '@/shared/const';

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const authStore = useAuthStore();

  const isRouteAuth = to.path === ROUTES.getRouteAuth();

  if (!authStore.user && !isRouteAuth)
    return navigateTo({ name: RouteNames.AUTH });
  else if (authStore.user && isRouteAuth)
    return navigateTo({ name: RouteNames.MAIN });
});

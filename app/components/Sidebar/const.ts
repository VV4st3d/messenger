import { navigateTo, useAuthStore } from '#imports';
import { RouteNames, ROUTES } from '~/shared/const';

const authStore = useAuthStore();
export const contextEvents: { label: string; callback: () => void }[] = [
  {
    label: 'Профиль',
    callback: () =>
      navigateTo(ROUTES.getRouteProfile(authStore.user?.id ?? RouteNames.AUTH)),
  },
  {
    label: 'Выход',
    callback: () => authStore.logout(),
  },
];

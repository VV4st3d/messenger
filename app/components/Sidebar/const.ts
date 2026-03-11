import { useAuthStore } from '#imports';
import { RouteNames, ROUTES } from '~/shared/const';

const authStore = useAuthStore();

export const dropdownItems: {
  label: string;
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
}[] = [
  {
    label: 'Профиль',
    href: ROUTES.getRouteProfile(authStore.user?.id ?? RouteNames.AUTH),
  },
  {
    label: 'Выход',
    onClick: () => authStore.logout(),
  },
];

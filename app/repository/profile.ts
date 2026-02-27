import { API_ROUTES } from '~/shared/const';
import type { TProfile } from '~/shared/types/profile';

export function createProfileRepository(appFetch: typeof $fetch) {
  return {
    getUserProfile(id: string) {
      return appFetch<TProfile>(API_ROUTES.getRouteProfile(id), {
        method: 'GET',
      });
    },
  };
}

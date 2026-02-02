import { API_ROUTES } from '~/shared/const';
import type { TFriendsResponse } from '~/shared/types';

export function createFriendsRepository(appFetch: typeof $fetch) {
  return {
    getFriends() {
      return appFetch<TFriendsResponse>(API_ROUTES.getRouteFriends(), {
        method: 'GET',
      });
    },
  };
}

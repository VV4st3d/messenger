import { API_ROUTES } from '~/shared/const';
import type { TFriends } from '~/shared/types';

export function createFriendsRepository(appFetch: typeof $fetch) {
  return {
    getFriends() {
      return appFetch<TFriends>(API_ROUTES.getRouteFriends(), {
        method: 'GET',
      });
    },
  };
}

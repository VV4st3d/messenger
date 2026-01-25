import { getAPIRouteFriends } from '~/shared/const';
import type { TFriends } from '~/shared/types';

export function createFriendsRepository(appFetch: typeof $fetch) {
  return {
    getFriends() {
      return appFetch<TFriends>(getAPIRouteFriends(), { method: 'GET' });
    },
  };
}

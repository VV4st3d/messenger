import { API_ROUTES } from '~/shared/const';
import type {
  IFriendRequest,
  TFriendsResponse,
  TSearchFriendsResponse,
} from '~/shared/types';

export function createFriendsRepository(appFetch: typeof $fetch) {
  return {
    getFriends() {
      return appFetch<TFriendsResponse>(API_ROUTES.getRouteFriends(), {
        method: 'GET',
      });
    },
    sendFriendRequest(body: { toUserId: string }) {
      return appFetch<IFriendRequest>(API_ROUTES.getRouteFriendRequest(), {
        method: 'POST',
        body,
      });
    },
    searchForFriends(query: { q: string }) {
      return appFetch<TSearchFriendsResponse>(
        API_ROUTES.getRouteSearchFriend(),
        {
          method: 'GET',
          query,
        },
      );
    },
  };
}

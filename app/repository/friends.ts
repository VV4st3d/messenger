import { API_ROUTES } from '~/shared/const';
import type {
  ICancelRequestResponse,
  IRemoveFriendResponse,
  TFriendRequestActionResponse,
  TFriendRequestResponse,
  TFriendsResponse,
  TRequestsIncomingResponse,
  TRequestsOutgoingResponse,
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
      return appFetch<TFriendRequestResponse>(
        API_ROUTES.getRouteFriendRequest(),
        {
          method: 'POST',
          body,
        },
      );
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
    removeFriend(id: string) {
      return appFetch<IRemoveFriendResponse>(
        API_ROUTES.getRouteRemoveFriend(id),
        {
          method: 'DELETE',
        },
      );
    },
    searchIncomingRequests() {
      return appFetch<TRequestsIncomingResponse>(
        API_ROUTES.getRouteIncomingFriendRequests(),
        {
          method: 'GET',
        },
      );
    },
    searchOutgoingRequests() {
      return appFetch<TRequestsOutgoingResponse>(
        API_ROUTES.getRouteOutgoingFriendRequests(),
        {
          method: 'GET',
        },
      );
    },
    acceptRequest(id: string) {
      return appFetch<TFriendRequestActionResponse>(
        API_ROUTES.getRouteAcceptFriendRequest(id),
        {
          method: 'POST',
        },
      );
    },
    rejectRequest(id: string) {
      return appFetch<TFriendRequestActionResponse>(
        API_ROUTES.getRouteRejectFriendRequest(id),
        {
          method: 'POST',
        },
      );
    },
    cancelRequest(id: string) {
      return appFetch<ICancelRequestResponse>(
        API_ROUTES.getRouteCancelFriendRequest(id),
        {
          method: 'DELETE',
        },
      );
    },
  };
}

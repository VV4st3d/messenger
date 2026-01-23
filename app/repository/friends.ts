import type { TFriends } from '~/shared/types';

export function createFriendsRepository(appFetch: typeof $fetch) {
  return {
    getFriends() {
      return appFetch<TFriends>('friends', { method: 'GET' });
    },
  };
}

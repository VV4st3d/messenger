import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IFriend } from '~/shared/types';

export const useFriendsStore = defineStore('friends', () => {
  const friends = ref<IFriend[]>([]);

  const setFriends = (payload: IFriend[]) => (friends.value = payload);

  return { friends, setFriends };
});

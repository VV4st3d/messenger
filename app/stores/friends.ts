import { useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IFriend } from '~/shared/types';

export const useFriendsStore = defineStore('friends', () => {
  const friends = ref<IFriend[]>([]);
  const { $api } = useNuxtApp();

  const setFriends = (payload: IFriend[]) => (friends.value = payload);

  const getFriendsHandler = async () => {
    try {
      const { data = [] } = await $api.friend.getFriends();
      setFriends(data);
    } catch (error) {
      console.error('error during finding friends: ', error);
    }
  };

  return { friends, setFriends, getFriendsHandler };
});

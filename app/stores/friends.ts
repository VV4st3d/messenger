import { useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IFoundUser, IFriend } from '~/shared/types';

export const useFriendsStore = defineStore('friends', () => {
  const friends = ref<IFriend[]>([]);
  const foundUsers = ref<IFoundUser[]>([]);
  const { $api } = useNuxtApp();

  const setFriends = (payload: IFriend[]) => (friends.value = payload);
  const setFoundUsers = (payload: IFoundUser[]) => (foundUsers.value = payload);

  const fetchFriends = async (): Promise<void> => {
    try {
      const { data = [] } = await $api.friend.getFriends();
      setFriends(data);
    } catch (error) {
      console.error('error during finding friends: ', error);
    }
  };

  const fetchUsers = async (query: { q: string }): Promise<void> => {
    try {
      const { data = [] } = await $api.friend.searchForFriends(query);
      setFoundUsers(data);
    } catch (error) {
      console.error('error during finding users: ', error);
    }
  };

  return {
    friends,
    foundUsers,
    setFriends,
    fetchFriends,
    fetchUsers,
  };
});

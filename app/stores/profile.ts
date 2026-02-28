import { useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { IProfile, TFriendRequestStatus } from '~/shared/types/profile';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<IProfile | null>(null);
  const { $api } = useNuxtApp();

  const setProfile = (payload: IProfile) => (profile.value = payload);
  const setFriendRequestStatus = (payload: TFriendRequestStatus) => {
    if (profile.value?.friendRequestStatus) {
      profile.value.friendRequestStatus = payload;
    }
  };
  const setFriendRequestId = (id: string) => {
    if (profile.value) profile.value.friendRequestId = id;
  };

  const fetchProfile = async (id: string): Promise<void> => {
    try {
      const { data } = await $api.profile.getUserProfile(id);
      setProfile(data);
    } catch (error) {
      console.error('error during fetching profile: ', error);
    }
  };

  return {
    profile,
    fetchProfile,
    setFriendRequestStatus,
    setFriendRequestId,
  };
});

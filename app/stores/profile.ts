import { useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import type {
  IEditProfileBody,
  IProfile,
  TFriendRequestStatus,
} from '~/shared/types/profile';

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

  const updateProfile = async (payload: IEditProfileBody): Promise<void> => {
    try {
      const formData = new FormData();
      if (payload.bio) formData.append('bio', payload.bio);
      if (payload.username) formData.append('username', payload.username);
      if (payload.displayName)
        formData.append('displayName', payload.displayName);
      if (payload.avatarUrl) formData.append('avatar', payload.avatarUrl);
      await $api.profile.editProfile(formData);
    } catch (error) {
      console.log('error during updating profile: ', error);
    }
  };

  return {
    profile,
    fetchProfile,
    setFriendRequestStatus,
    setFriendRequestId,
    updateProfile,
  };
});

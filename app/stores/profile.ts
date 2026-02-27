import { useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';


import type { IProfile } from '~/shared/types/profile';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<IProfile | null>(null);
  const setProfile = (payload: IProfile) => (profile.value = payload);
  const { $api } = useNuxtApp();

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
  };
});

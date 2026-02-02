import { useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IChat } from '~/shared/types';

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<IChat[]>([]);
  const { $api } = useNuxtApp();
  const setChats = (payload: IChat[]) => (chats.value = payload);

  const getChatsHandler = async () => {
    try {
      const { data } = await $api.chats.getChats();
      setChats(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return { chats, setChats, getChatsHandler };
});

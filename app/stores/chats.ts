import { useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IChat, IMessage } from '~/shared/types';

export const useChatsStore = defineStore('chats', () => {
  const { $api } = useNuxtApp();
  const chats = ref<IChat[]>([]);
  const globalFoundMessage = ref<IMessage[]>([]);

  const setChats = (payload: IChat[]) => (chats.value = payload);
  const setGlobalFoundMessages = (payload: IMessage[]) =>
    (globalFoundMessage.value = payload);

  const fetchChats = async (): Promise<void> => {
    try {
      const { data = [] } = await $api.chats.getChats();
      setChats(data);
    } catch (error) {
      console.error('error during finding chats', error);
      throw error;
    }
  };

  const fetchGlobalMessages = async (payload: { query: string }) => {
    if (!payload.query.length) {
      globalFoundMessage.value = [];
      return;
    }
    try {
      const { data = [] } =
        await $api.chats.getGlobalChatsMessagesBySearch(payload);
      setGlobalFoundMessages(data);
    } catch (error) {
      console.error('error during finding messages', error);
    }
  };

  return {
    chats,
    globalFoundMessage,
    fetchChats,
    fetchGlobalMessages,
  };
});

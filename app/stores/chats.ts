import { useNuxtApp } from '#app';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IChat, IMessage } from '~/shared/types';

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<IChat[]>([]);
  const { $api } = useNuxtApp();
  const globalFoundMessage = ref<IMessage[]>([]);

  const setChats = (payload: IChat[]) => (chats.value = payload);
  const setGlobalFoundMessages = (payload: IMessage[]) =>
    (globalFoundMessage.value = payload);

  const getChatsHandler = async (): Promise<void> => {
    try {
      const { data } = await $api.chats.getChats();
      setChats(data);
    } catch (error) {
      console.error('error during finding chats', error);
      throw error;
    }
  };

  const handleGetGlobalMessages = async (query: { query: string }) => {
    if (!query.query.length) {
      globalFoundMessage.value = [];
      return;
    }
    try {
      const { data } = await $api.chats.getGlobalChatsMessagesBySearch(query);
      setGlobalFoundMessages(data);
    } catch (error) {
      console.error('error during finding messages', error);
    }
  };

  return {
    chats,
    globalFoundMessage,
    setChats,
    getChatsHandler,
    handleGetGlobalMessages,
  };
});

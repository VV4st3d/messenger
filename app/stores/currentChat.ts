import { useNuxtApp } from '#imports';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IChat, IMessage } from '~/shared/types';

export const useCurrentChatStore = defineStore('currentChat', () => {
  const { $api } = useNuxtApp();
  const chat = ref<Omit<IChat, 'lastMessage'> | null>(null);
  const messages = ref<IMessage[]>([]);

  const setChat = (payload: IChat) => (chat.value = payload);
  const setMessages = (payload: IMessage[]) => (messages.value = payload);
  const pushMessage = (payload: IMessage) => messages.value.push(payload);

  const getChatInfoHandler = async (chatId: string) => {
    try {
      const { data } = await $api.chats.getChat(chatId);
      setChat(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getMessagesHandler = async (chatId: string) => {
    try {
      const { data } = await $api.chats.getMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return {
    chat,
    setChat,
    messages,
    setMessages,
    pushMessage,
    getChatInfoHandler,
    getMessagesHandler,
  };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IChat, IMessage } from '~/shared/types';

export const useCurrentChatStore = defineStore('currentChat', () => {
  const chat = ref<Omit<IChat, 'lastMessage'> | null>(null);
  const messages = ref<IMessage[]>([]);

  const setChat = (payload: IChat) => (chat.value = payload);
  const setMessages = (payload: IMessage[]) => (messages.value = payload);
  const pushMessage = (payload: IMessage) => messages.value.push(payload);

  return { chat, setChat, messages, setMessages, pushMessage };
});

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IChat } from '~/shared/types';

export const useChatsStore = defineStore('chats', () => {
  const chats = ref<IChat[]>([]);

  const setChats = (payload: IChat[]) => (chats.value = payload);

  return { chats, setChats };
});

import { useNuxtApp } from '#imports';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SOCKET_EMIT_EVENTS, SOCKET_ON_EVENTS } from '~/shared/const';

import type {
  IChat,
  IGetMessageQuery,
  IMessage,
  ITyping,
} from '~/shared/types';

export const useCurrentChatStore = defineStore('currentChat', () => {
  const { $api, $socket } = useNuxtApp();
  const chat = ref<Omit<IChat, 'lastMessage'> | undefined>(undefined);
  const messages = ref<IMessage[]>([]);
  const typing = ref<ITyping>();
  const lastMessageDate = ref<string>();
  const setChat = (payload: IChat) => (chat.value = payload);
  const setTyping = (payload: ITyping) => (typing.value = payload);
  const pushMessage = (payload: IMessage) => messages.value.push(payload);
  const resetMessages = () => (messages.value = []);

  const bindEvents = () => {
    $socket.on(SOCKET_ON_EVENTS.NEW_MESSAGE, pushMessage);
    $socket.on(SOCKET_ON_EVENTS.TYPING, setTyping);
    if (chat.value) {
      $socket.emit(SOCKET_EMIT_EVENTS.JOIN_CHAT, chat.value.id);
    }
  };

  const unbindEvents = () => {
    $socket.off(SOCKET_ON_EVENTS.NEW_MESSAGE);
    $socket.off(SOCKET_ON_EVENTS.TYPING);
  };

  const handleStopTyping = () => {
    if (chat.value) $socket.emit(SOCKET_EMIT_EVENTS.STOP_TYPING, chat.value.id);
  };

  const handleStartTyping = () => {
    if (chat.value) $socket.emit(SOCKET_EMIT_EVENTS.TYPING, chat.value.id);
  };

  const sendMessageHandler = (content: string) => {
    if (chat.value?.id)
      $socket.emit(SOCKET_EMIT_EVENTS.SEND_MESSAGE, {
        chatId: chat.value?.id,
        content,
        type: 'text',
      });
  };

  const getChatInfoHandler = async (chatId: string): Promise<void> => {
    try {
      const { data } = await $api.chats.getChat(chatId);
      setChat(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getMessagesHandler = async (
    chatId: string,
    query?: IGetMessageQuery,
  ): Promise<void> => {
    try {
      const { data } = await $api.chats.getMessages(chatId, query);
      lastMessageDate.value = data.messages[0]?.createdAt;
      messages.value.unshift(...data.messages);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    unbindEvents,
    typing,
    bindEvents,
    chat,
    messages,
    setChat,
    lastMessageDate,
    handleStopTyping,
    resetMessages,
    handleStartTyping,
    sendMessageHandler,
    getChatInfoHandler,
    getMessagesHandler,
    pushMessage,
  };
});

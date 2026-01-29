import { useNuxtApp } from '#imports';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SOCKET_EMIT_EVENTS, SOCKET_ON_EVENTS } from '~/shared/const';

import type { IChat, IMessage, ITyping } from '~/shared/types';

export const useCurrentChatStore = defineStore('currentChat', () => {
  const { $api, $socket } = useNuxtApp();
  const chat = ref<Omit<IChat, 'lastMessage'> | null>(null);
  const messages = ref<IMessage[]>([]);
  const typing = ref<ITyping>();

  const setChat = (payload: IChat) => (chat.value = payload);
  const setMessages = (payload: IMessage[]) => (messages.value = payload);
  const pushMessage = (payload: IMessage) => messages.value.push(payload);

  const bindEvents = () => {
    $socket.on(SOCKET_ON_EVENTS.NEW_MESSAGE, (payload) => pushMessage(payload));
    $socket.on('typing', (payload) => {
      typing.value = payload;
    });
    if (chat.value) {
      $socket.emit(SOCKET_EMIT_EVENTS.JOIN_CHAT, chat.value.id);
    }
  };

  const handleStopTyping = () => {
    if (chat.value) $socket.emit(SOCKET_EMIT_EVENTS.STOP_TYPING, chat.value.id);
  };

  const handleStartTypeing = () => {
    if (chat.value) $socket.emit(SOCKET_EMIT_EVENTS.TYPING, chat.value.id);
  };

  const sendMessageHandler = (content: string) => {
    if (chat.value)
      $socket.emit(SOCKET_EMIT_EVENTS.SEND_MESSAGE, {
        chatId: chat.value?.id,
        content,
        type: 'text',
      });
  };

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
    typing,
    handleStopTyping,
    handleStartTypeing,
    sendMessageHandler,
    bindEvents,
    chat,
    setChat,
    messages,
    setMessages,
    pushMessage,
    getChatInfoHandler,
    getMessagesHandler,
  };
});

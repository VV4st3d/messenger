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
  const foundMessages = ref<IMessage[]>([]);
  const lastMessageDate = ref<string>();
  const hasMore = ref<boolean>();
  const setChat = (payload: IChat) => (chat.value = payload);
  const setTyping = (payload: ITyping) => (typing.value = payload);
  const pushMessage = (payload: IMessage) => messages.value.push(payload);
  const resetMessages = () => (messages.value = []);
  const setFoundMessages = (payload: IMessage[]) =>
    (foundMessages.value = payload);

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
      hasMore.value = data.hasMore;
      messages.value.unshift(...data.messages);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleFindMessages = async (
    chatId: string,
    query: { query: string },
  ): Promise<void> => {
    if (!query.query.length) {
      foundMessages.value = [];
      return;
    }
    try {
      const { data } = await $api.chats.getChatMessagesBySearch(chatId, query);
      setFoundMessages(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    unbindEvents,
    typing,
    hasMore,
    bindEvents,
    chat,
    messages,
    foundMessages,
    handleFindMessages,
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

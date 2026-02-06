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
  const anchorMessageId = ref<string>();
  const firstMessageDateInList = ref<string>();
  const lastMessageDateInList = ref<string>();
  const hasMoreTop = ref<boolean>();
  const hasMoreBottom = ref<boolean>();
  const isFoundBySearch = ref<boolean>(false);
  const isFinding = ref<boolean>(false);
  const setChat = (payload: IChat) => (chat.value = payload);
  const setTyping = (payload: ITyping) => (typing.value = payload);
  const pushMessage = (payload: IMessage) => messages.value.push(payload);
  const resetMessages = () => (messages.value = []);
  const setMessages = (payload: IMessage[]) => (messages.value = payload);
  const setFoundMessages = (payload: IMessage[]) =>
    (foundMessages.value = payload);

  const bindEvents = () => {
    $socket.on(SOCKET_ON_EVENTS.NEW_MESSAGE, async (payload) => {
      if (!isFoundBySearch.value) {
        pushMessage(payload);
        return;
      }
      isFoundBySearch.value = false;
      if (chat.value?.id) await getMessagesHandler(chat.value?.id);
    });
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
    isFoundBySearch.value = false;
    try {
      const { data } = await $api.chats.getMessages(chatId, query);
      switch (query?.direction) {
        case 'after':
          messages.value.push(...data.messages);
          hasMoreBottom.value = data.hasMoreBottom;
          lastMessageDateInList.value =
            data.messages[data.messages.length - 1]?.createdAt;
          break;
        case 'before':
          firstMessageDateInList.value = data.messages[0]?.createdAt;
          messages.value.unshift(...data.messages);
          hasMoreTop.value = data.hasMoreTop;
          break;
        default:
          firstMessageDateInList.value = data.messages[0]?.createdAt;
          messages.value = data.messages;
          hasMoreTop.value = data.hasMoreTop;
          break;
      }
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

  const handleMessagesById = async (chatId: string) => {
    try {
      isFinding.value = true;
      const { data } = await $api.chats.getMessagesListByMessageId(chatId);
      setMessages(data.messages);

      anchorMessageId.value = data.anchorMessageId;
      hasMoreTop.value = data.hasMoreTop;
      hasMoreBottom.value = data.hasMoreBottom;

      firstMessageDateInList.value = data.messages[0]?.createdAt;
      lastMessageDateInList.value =
        data.messages[data.messages.length - 1]?.createdAt;

      isFoundBySearch.value = true;
    } catch (error) {
      console.log(error);
    } finally {
      isFinding.value = false;
    }
  };

  return {
    isFinding,
    typing,
    hasMoreTop,
    hasMoreBottom,
    chat,
    messages,
    foundMessages,
    firstMessageDateInList,
    lastMessageDateInList,
    anchorMessageId,
    isFoundBySearch,
    setChat,
    handleFindMessages,
    handleStopTyping,
    handleMessagesById,
    resetMessages,
    handleStartTyping,
    sendMessageHandler,
    getChatInfoHandler,
    getMessagesHandler,
    unbindEvents,
    bindEvents,
  };
});

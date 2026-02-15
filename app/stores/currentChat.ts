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
  const chat = ref<Omit<IChat, 'lastMessage'> | null>(null);
  const messages = ref<IMessage[]>([]);
  const typing = ref<ITyping | null>(null);
  const foundMessages = ref<IMessage[]>([]);
  const pinnedMessages = ref<IMessage[]>([]);
  const anchorMessageId = ref('');
  const firstMessageDateInList = ref('');
  const lastMessageDateInList = ref('');
  const hasMoreTop = ref(false);
  const hasMoreBottom = ref(false);
  const isFoundBySearch = ref(false);
  const isSearching = ref(false);
  const isGeneraringSummary = ref<{ isGenerating: boolean; id: string | null }>(
    { isGenerating: false, id: null },
  );
  const setChat = (payload: IChat) => (chat.value = payload);
  const setTyping = (payload: ITyping) => (typing.value = payload);
  const pushMessage = (payload: IMessage) => messages.value.push(payload);
  const resetMessages = () => (messages.value = []);
  const setMessages = (payload: IMessage[]) => (messages.value = payload);
  const setFoundMessages = (payload: IMessage[]) =>
    (foundMessages.value = payload);
  const setPinnedMessages = (payload: IMessage[]) =>
    (pinnedMessages.value = payload);

  const bindEvents = () => {
    $socket.on(SOCKET_ON_EVENTS.NEW_MESSAGE, async (payload) => {
      if (!isFoundBySearch.value) {
        pushMessage(payload);
        return;
      }
      isFoundBySearch.value = false;
      if (chat.value?.id) await fetchMessages(chat.value?.id);
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

  const stopTyping = () => {
    if (chat.value) $socket.emit(SOCKET_EMIT_EVENTS.STOP_TYPING, chat.value.id);
  };

  const startTyping = () => {
    if (chat.value) $socket.emit(SOCKET_EMIT_EVENTS.TYPING, chat.value.id);
  };

  const sendMessage = (content: string) => {
    if (chat.value?.id)
      $socket.emit(SOCKET_EMIT_EVENTS.SEND_MESSAGE, {
        chatId: chat.value?.id,
        content,
        type: 'text',
      });
  };

  const fetchChatInfo = async (chatId: string): Promise<void> => {
    try {
      const { data } = await $api.chats.getChat(chatId);
      setChat(data);
    } catch (error) {
      console.error('error while trying to get chat info: ', error);
      throw error;
    }
  };

  const fetchMessages = async (
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
            data.messages[data.messages.length - 1]?.createdAt ?? '';
          break;
        case 'before':
          firstMessageDateInList.value = data.messages[0]?.createdAt ?? '';
          messages.value.unshift(...data.messages);
          hasMoreTop.value = data.hasMoreTop;
          break;
        default:
          firstMessageDateInList.value = data.messages[0]?.createdAt ?? '';
          messages.value = data.messages;
          hasMoreTop.value = data.hasMoreTop;
          break;
      }
    } catch (error) {
      console.error('error during getting messages: ', error);
      throw error;
    }
  };

  const fetchMessagesByQuery = async (
    chatId: string,
    query: { query: string },
  ): Promise<void> => {
    if (!query.query.length) {
      foundMessages.value = [];
      return;
    }
    try {
      const { data = [] } = await $api.chats.getChatMessagesBySearch(
        chatId,
        query,
      );
      setFoundMessages(data);
    } catch (error) {
      console.error('error during finding messages: ', error);
      throw error;
    }
  };

  const fetchMessagesById = async (chatId: string) => {
    try {
      isSearching.value = true;
      const { data } = await $api.chats.getMessagesListByMessageId(chatId);
      setMessages(data.messages);

      anchorMessageId.value = data.anchorMessageId;
      hasMoreTop.value = data.hasMoreTop;
      hasMoreBottom.value = data.hasMoreBottom;

      firstMessageDateInList.value = data.messages[0]?.createdAt ?? '';
      lastMessageDateInList.value =
        data.messages[data.messages.length - 1]?.createdAt ?? '';

      isFoundBySearch.value = true;
    } catch (error) {
      console.log('error during finding messages by id: ', error);
    } finally {
      isSearching.value = false;
    }
  };

  const fetchPinnedMessages = async (id: string) => {
    try {
      const { data = [] } = await $api.chats.getPinnedMessages(id);
      setPinnedMessages(data.reverse());
    } catch (error) {
      console.error('error during finding pinned messages: ', error);
    }
  };

  const pinMessage = async (messageId: string, chatId: string) => {
    try {
      const { data } = await $api.chats.pinMessage(
        { chatId: chatId },
        messageId,
      );
      pinnedMessages.value.unshift(data);
    } catch (error) {
      console.error('error during pin message: ', error);
    }
  };

  const unpinMessage = async (messageId: string, chatId: string) => {
    try {
      const { data } = await $api.chats.unpinMessage(
        { chatId: chatId },
        messageId,
      );
      if (data) {
        pinnedMessages.value = pinnedMessages.value.filter(
          (msg) => msg.id !== data.id,
        );
      }
    } catch (error) {
      console.error('error during pin message: ', error);
    }
  };

  const generateMessageSummary = async (messageId: string): Promise<void> => {
    try {
      isGeneraringSummary.value = { isGenerating: true, id: messageId };
      const { data } = await $api.chats.generateSummaryMessage(messageId);
      messages.value = messages.value.reduce((acc: IMessage[], value) => {
        if (value.id !== messageId) {
          acc.push(value);
          return acc;
        }
        acc.push({ ...value, content: data.summary });
        return acc;
      }, []);
    } catch (error) {
      console.error('error then trying to generate summary: ', error);
    } finally {
      isGeneraringSummary.value = { isGenerating: false, id: null };
    }
  };

  return {
    isSearching,
    isGeneraringSummary,
    typing,
    hasMoreTop,
    hasMoreBottom,
    chat,
    messages,
    foundMessages,
    pinnedMessages,
    firstMessageDateInList,
    lastMessageDateInList,
    anchorMessageId,
    isFoundBySearch,
    setChat,
    fetchMessagesByQuery,
    stopTyping,
    fetchMessagesById,
    resetMessages,
    startTyping,
    sendMessage,
    fetchChatInfo,
    fetchMessages,
    unbindEvents,
    bindEvents,
    fetchPinnedMessages,
    pinMessage,
    unpinMessage,
    generateMessageSummary,
  };
});

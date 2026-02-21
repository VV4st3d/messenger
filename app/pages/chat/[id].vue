<script setup lang="ts">
import {
  computed,
  copyText,
  onMounted,
  onUnmounted,
  ref,
  storeToRefs,
  useAuthStore,
  useCurrentChatStore,
  useDebounce,
  useThrottling,
} from '#imports';
import { useRoute } from 'vue-router';
import ChatFooter from '~/components/Chat/ChatFooter.vue';
import { TYPING_MESSAGE_DELAY_MS } from '~/components/Chat/const';
import { SEARCH_DELAY_MS } from '~/shared/const/delay';
import type { IContextMenu, IMessage } from '~/shared/types';

const { params } = useRoute();
const chatId = params.id as string;
const messageText = ref<string>('');
const isDropdownOpen = ref(false);
const queryInput = ref('');

const chatStore = useCurrentChatStore();
const authStore = useAuthStore();

const userId = computed(() => authStore.user?.id);

const {
  chat,
  typing,
  firstMessageDateInList,
  lastMessageDateInList,
  hasMoreTop,
  hasMoreBottom,
  foundMessages,
  isFoundBySearch,
  anchorMessageId,
  isSearching,
  pinnedMessages,
  isGeneraringSummary,
} = storeToRefs(chatStore);
const {
  fetchMessagesById,
  fetchMessages,
  sendMessage,
  bindEvents,
  unbindEvents,
  fetchChatInfo,
  resetMessages,
  startTyping,
  fetchMessagesByQuery,
  fetchPinnedMessages,
  pinMessage,
  unpinMessage,
  generateMessageSummary,
  uploadAttachedToMessageFile,
} = chatStore;

const contextMenu = ref<IContextMenu & { message: IMessage | null }>({
  isVisible: false,
  x: 0,
  y: 0,
  message: null,
});

const openContextMenuHandler = ({
  event,
  message,
}: {
  event: MouseEvent;
  message: IMessage;
}) => {
  contextMenu.value = {
    isVisible: true,
    x: event.clientX,
    y: event.clientY,
    message,
  };
};

const contextEvents = computed(() => {
  if (!contextMenu.value.message) return [];

  const msg = contextMenu.value.message;

  return [
    {
      label: 'Закрепить',
      callback: () => pinMessage(msg.id, chatId),
    },
    {
      label: 'Копировать',
      callback: () => copyText(msg.content, closeContextMenu),
    },
    {
      label: 'Сгенерировать кратко',
      callback: () => generateMessageSummary(msg.id),
      icon: { name: 'ri:ai-generate-2', color: 'var(--accent)' },
    },
  ];
});

const closeContextMenu = () => {
  contextMenu.value.isVisible = false;
};

const onToggleSearchingDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const fetchMessagesByQueryDebounced = useDebounce(
  fetchMessagesByQuery,
  SEARCH_DELAY_MS,
);

const startTypingThrottled = useThrottling(
  startTyping,
  TYPING_MESSAGE_DELAY_MS,
);

const searchHandler = () => {
  fetchMessagesByQueryDebounced(chatId, {
    query: queryInput.value,
  });
};

const foundOrPinnedMessageClickHandler = async (
  messageId: string,
): Promise<void> => {
  try {
    await fetchMessagesById(messageId);
  } catch (error) {
    console.log('Ошибка поиска сообщений');
  } finally {
    isDropdownOpen.value = false;
  }
};

const uploadFileWithMessageTextHandler = async (file: File) => {
  try {
    await uploadAttachedToMessageFile({
      chatId,
      content: messageText.value,
      file,
    });
    messageText.value = '';
  } catch (error) {
    console.log('Ошибка при отправке файла');
  }
};

const sendMessageHandler = () => {
  sendMessage(messageText.value);
  messageText.value = '';
};

const unpinMessageHandler = async (messageId: string) => {
  try {
    await unpinMessage(messageId, chatId);
  } catch (error) {
    console.log('Ошибка при удалении сообщения из закрепленных');
  }
};

const closeAllPopups = () => {
  isDropdownOpen.value = false;
  closeContextMenu();
};

onMounted(async () => {
  window.addEventListener('click', closeAllPopups);

  await Promise.all([fetchChatInfo(chatId), fetchPinnedMessages(chatId)]);

  if (chatStore.messages.length === 0 && !isSearching.value)
    await fetchMessages(chatId);
  bindEvents();
});

onUnmounted(() => {
  window.removeEventListener('click', closeAllPopups);
  unbindEvents();
});
</script>

<template>
  <div class="flex flex-col h-full">
    <ChatHeader
      v-model="queryInput"
      :found-messages="foundMessages"
      :is-searching="isDropdownOpen"
      :typing="typing"
      :chat="chat"
      :chat-id="chatId"
      @message-click="foundOrPinnedMessageClickHandler"
      @search="searchHandler"
      @open-search-dropdown="onToggleSearchingDropdown"
    />

    <MessageSpace
      :generated-summary="isGeneraringSummary"
      :context-events="contextEvents"
      :context-menu="contextMenu"
      :pinned-messages="pinnedMessages"
      :user-id="userId"
      :anchor-message-id="anchorMessageId"
      :is-found-by-search="isFoundBySearch"
      :has-more-top="hasMoreTop"
      :has-more-bottom="hasMoreBottom"
      :on-fetch-messages="fetchMessages"
      :first-message-date-in-list="firstMessageDateInList"
      :last-message-date-in-list="lastMessageDateInList"
      :chat="chat"
      :messages="chatStore.messages"
      @unmount="resetMessages"
      @click-pinned="foundOrPinnedMessageClickHandler"
      @open-context-menu="openContextMenuHandler"
      @unpin-message="unpinMessageHandler"
    />

    <ChatFooter
      v-model="messageText"
      @start-typing="startTypingThrottled"
      @send-message="sendMessageHandler"
      @upload-file="uploadFileWithMessageTextHandler"
    />
  </div>
</template>

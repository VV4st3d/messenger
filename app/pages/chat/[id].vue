<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  storeToRefs,
  useAuthStore,
  useCurrentChatStore,
  useDebounce,
} from '#imports';
import { useRoute } from 'vue-router';
import ChatFooter from '~/components/Chat/ChatFooter.vue';
import { SEARCH_DELAY_MS } from '~/shared/const/delay';

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
} = chatStore;

const onToggleSearchingDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const fetchMessagesByQueryDebounced = useDebounce(
  fetchMessagesByQuery,
  SEARCH_DELAY_MS,
);
const searchHandler = () => {
  fetchMessagesByQueryDebounced(chatId, {
    query: queryInput.value,
  });
};

const foundMessageClickHandler = async (messageId: string): Promise<void> => {
  await fetchMessagesById(messageId);
  isDropdownOpen.value = false;
};

const handleGetChatInfo = async () => {
  try {
    await fetchChatInfo(chatId);
  } catch (error) {
    console.log(error);
  }
};

const handleGetMessages = async () => {
  try {
    await fetchMessages(chatId);
  } catch (error) {
    console.log(error);
  }
};

const handleSendMessage = () => {
  sendMessage(messageText.value);
  messageText.value = '';
};

onMounted(async () => {
  await handleGetChatInfo();
  if (chatStore.messages.length === 0 && !isSearching.value)
    await handleGetMessages();
  bindEvents();
});

onUnmounted(() => {
  unbindEvents();
});
</script>

<template>
  <div class="flex flex-col h-full" @click="isDropdownOpen = false">
    <ChatHeader
      v-model="queryInput"
      :found-messages="foundMessages"
      :is-searching="isDropdownOpen"
      :typing="typing"
      :chat="chat"
      :chat-id="chatId"
      @message-click="foundMessageClickHandler"
      @search="searchHandler"
      @open-search-dropdown="onToggleSearchingDropdown"
    />

    <MessageSpace
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
    />

    <ChatFooter
      v-model="messageText"
      :on-start-typing="startTyping"
      :on-send-message="handleSendMessage"
    />
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
  background-color: var(--text-secondary);
}
</style>

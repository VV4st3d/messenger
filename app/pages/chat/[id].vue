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
import { SEARCH_MESSAGE_DELAY_MS } from '~/shared/const/delay';

const { params } = useRoute();
const chatId = params.id as string;
const messageText = ref<string>('');
const isSearching = ref(false);
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
  isFinding,
} = storeToRefs(chatStore);
const {
  handleMessagesById,
  getMessagesHandler,
  sendMessageHandler,
  bindEvents,
  unbindEvents,
  getChatInfoHandler,
  resetMessages,
  handleStartTyping,
  handleFindMessages,
} = chatStore;

const onToggleSearchingDropdown = () =>
  (isSearching.value = !isSearching.value);

const handleFindMessagesDebounced = useDebounce(
  handleFindMessages,
  SEARCH_MESSAGE_DELAY_MS,
);
const onSearch = () => {
  handleFindMessagesDebounced(chatId, {
    query: queryInput.value,
  });
};

const onClickFoundMessage = async (chatId: string): Promise<void> => {
  await handleMessagesById(chatId);
  isSearching.value = false;
};

const handleGetChatInfo = async () => {
  try {
    await getChatInfoHandler(chatId);
  } catch (error) {
    console.log(error);
  }
};

const handleGetMessages = async () => {
  try {
    await getMessagesHandler(chatId);
  } catch (error) {
    console.log(error);
  }
};

const handleSendMessage = () => {
  sendMessageHandler(messageText.value);
  messageText.value = '';
};

onMounted(async () => {
  await handleGetChatInfo();
  if (chatStore.messages.length === 0 && !isFinding.value)
    await handleGetMessages();
  bindEvents();
});

onUnmounted(() => {
  unbindEvents();
});
</script>

<template>
  <div class="flex flex-col h-full" @click="isSearching = false">
    <ChatHeader
      v-model="queryInput"
      :on-message-click="onClickFoundMessage"
      :found-messages="foundMessages"
      :is-searching="isSearching"
      :on-search="onSearch"
      :on-open-searching-dropdown="onToggleSearchingDropdown"
      :typing="typing"
      :chat="chat"
      :chat-id="chatId"
    />

    <MessageSpace
      :user-id="userId"
      :anchor-message-id="anchorMessageId"
      :is-found-by-search="isFoundBySearch"
      :has-more-top="hasMoreTop"
      :has-more-bottom="hasMoreBottom"
      :get-messeges="getMessagesHandler"
      :reset-messages="resetMessages"
      :first-message-date-in-list="firstMessageDateInList"
      :last-message-date-in-list="lastMessageDateInList"
      :chat="chat"
      :messages="chatStore.messages"
    />

    <ChatFooter
      v-model="messageText"
      :handle-start-typing="handleStartTyping"
      :handle-send-message="handleSendMessage"
    />
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
  background-color: var(--text-secondary);
}
</style>

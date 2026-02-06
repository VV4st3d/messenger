<script setup lang="ts">
import {
  onMounted,
  onUnmounted,
  ref,
  storeToRefs,
  useCurrentChatStore,
} from '#imports';
import { useRoute } from 'vue-router';
import ChatFooter from '~/components/Chat/ChatFooter.vue';

const { params } = useRoute();
const chatId = params.id as string;
const messageText = ref<string>('');
const isSearching = ref(false);

const chatStore = useCurrentChatStore();

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
      :on-message-click="handleMessagesById"
      :found-messages="foundMessages"
      :handle-find-message="handleFindMessages"
      :is-searching="isSearching"
      :on-open-searching-dropdown="onToggleSearchingDropdown"
      :typing="typing"
      :chat="chat"
      :chat-id="chatId"
    />

    <MessageSpace
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

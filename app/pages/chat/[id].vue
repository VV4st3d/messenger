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

const chatStore = useCurrentChatStore();

const { chat, typing, lastMessageDate } = storeToRefs(chatStore);
const {
  getMessagesHandler,
  sendMessageHandler,
  bindEvents,
  unbindEvents,
  getChatInfoHandler,
  resetMessages,
  handleStartTyping,
} = chatStore;

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
  await Promise.all([handleGetChatInfo(), handleGetMessages()]);
  bindEvents();
});

onUnmounted(() => {
  unbindEvents();
});
</script>

<template>
  <div class="flex flex-col h-full">
    <ChatHeader :typing="typing" :chat="chat" />

    <MessageSpace
      :get-messeges="getMessagesHandler"
      :reset-messages="resetMessages"
      :last-message-date="lastMessageDate"
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

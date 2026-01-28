<script setup lang="ts">
import {
  onMounted,
  ref,
  storeToRefs,
  useCurrentChatStore,
  useNuxtApp,
} from '#imports';
import { useRoute } from 'vue-router';
import ChatFooter from '~/components/Chat/ChatFooter.vue';

const { params } = useRoute();
const chatId = params.id as string;
const messageText = ref<string>('');

const chatStore = useCurrentChatStore();

const { chat } = storeToRefs(chatStore);

const { $socket } = useNuxtApp();

const handleGetChatInfo = async () => {
  try {
    await useCurrentChatStore().getChatInfoHandler(chatId);
  } catch (error) {
    console.log(error);
  }
};

const handleGetMessages = async () => {
  try {
    await useCurrentChatStore().getMessagesHandler(chatId);
  } catch (error) {
    console.log(error);
  }
};

const handleSendMessage = () => {
  chatStore.sendMessageHandler(messageText.value);
  messageText.value = '';
};

onMounted(async () => {
  await handleGetChatInfo();
  await handleGetMessages();
  chatStore.bindEvents();
});
</script>

<template>
  <div class="flex flex-col h-full">
    <ChatHeader :chat="chat" />

    <MessageSpace :messages="chatStore.messages" />

    <ChatFooter
      v-model="messageText"
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

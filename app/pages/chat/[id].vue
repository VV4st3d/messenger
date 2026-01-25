<script setup lang="ts">
import {
  onMounted,
  ref,
  storeToRefs,
  useCurrentChatStore,
  useNuxtApp,
} from '#imports';
import { useRoute } from 'vue-router';
import { SOCKET_EVENTS } from '~/shared/const';

const { params } = useRoute();
const chatId = params.id as string;
const messageText = ref<string>('');

const chatStore = useCurrentChatStore();

const { chat } = storeToRefs(chatStore);

const { $api, $socket } = useNuxtApp();

const handleGetChatInfo = async () => {
  try {
    const { data } = await $api.chats.getChat(chatId);
    chatStore.setChat(data);
  } catch (error) {
    console.log(error);
  }
};

const handleGetMessages = async () => {
  try {
    const { data } = await $api.chats.getMessages(chatId);
    chatStore.setMessages(data);
  } catch (error) {
    console.log(error);
  }
};

const handleSendMessage = () => {
  $socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
    chatId,
    content: messageText.value,
    type: 'text',
  });
  messageText.value = '';
};

onMounted(async () => {
  await $socket.connect();
  $socket.emit(SOCKET_EVENTS.JOIN_CHAT, chatId);
  handleGetChatInfo();
  handleGetMessages();
});
</script>

<template>
  <div class="flex flex-col h-full">
    <ChatHeader :chat="chat" />

    <MessageSpace :messages="chatStore.messages" />

    <footer class="chat-input-container">
      <button>
        <UiIcon name="paper-clip" size="24" />
      </button>

      <textarea
        v-model="messageText"
        placeholder="Напишите сообщение..."
        rows="1"
        class="flex-1 resize-none bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
        @keyup.enter="handleSendMessage"
      />

      <button :disabled="!messageText" @click="handleSendMessage">
        <UiIcon name="paper-airplane" size="24" />
      </button>
    </footer>
  </div>
</template>

<style scoped>
button:disabled {
  cursor: not-allowed;
  background-color: var(--text-secondary);
}
</style>

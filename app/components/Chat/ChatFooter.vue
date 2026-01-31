<script setup lang="ts">
import { useCurrentChatStore, useThrottling } from '#imports';

const messageText = defineModel<string>();
defineProps<{ handleSendMessage: () => void }>();
const { handleStartTyping } = useCurrentChatStore();

const startTyping = useThrottling(handleStartTyping, 2000);

const onTypeMessage = () => {
  startTyping();
};
</script>
<template>
  <footer class="chat-input-container">
    <button>
      <UiIcon name="paper-clip" size="24" />
    </button>

    <textarea
      v-model="messageText"
      placeholder="Напишите сообщение..."
      rows="1"
      class="flex-1 resize-none bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
      @input="onTypeMessage"
      @keyup.enter="handleSendMessage"
    />

    <button :disabled="!messageText" @click="handleSendMessage">
      <UiIcon name="paper-airplane" size="24" />
    </button>
  </footer>
</template>

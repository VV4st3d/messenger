<script setup lang="ts">
import { useThrottling } from '#imports';
import Icon from '../ui/Icon.vue';
import { TYPING_MESSAGE_DELAY } from './const';

const messageText = defineModel<string>();
interface IProps {
  handleSendMessage: () => void;
  handleStartTyping: () => void;
}
const props = defineProps<IProps>();

const startTyping = useThrottling(
  props.handleStartTyping,
  TYPING_MESSAGE_DELAY,
);

const onTypeMessage = () => {
  startTyping();
};
</script>
<template>
  <footer class="chat-input-container">
    <button>
      <Icon name="paper-clip" size="24" />
    </button>

    <textarea
      v-model="messageText"
      placeholder="Напишите сообщение..."
      rows="1"
      class="flex-1 resize-none bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
      @input="onTypeMessage"
      @keydown.enter.exact.prevent="handleSendMessage"
    />

    <button :disabled="!messageText" @click="handleSendMessage">
      <Icon name="paper-airplane" size="24" />
    </button>
  </footer>
</template>

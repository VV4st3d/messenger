<script setup lang="ts">
import { useThrottling } from '#imports';
import Icon from '../ui/Icon.vue';
import { TYPING_MESSAGE_DELAY_MS } from './const';

const messageText = defineModel<string>();
interface IProps {
  onSendMessage: () => void;
  onStartTyping: () => void;
}
const props = defineProps<IProps>();

const startTyping = useThrottling(props.onStartTyping, TYPING_MESSAGE_DELAY_MS);
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
      @input="startTyping"
      @keydown.enter.exact.prevent="onSendMessage"
    />

    <button :disabled="!messageText" @click="onSendMessage">
      <Icon name="paper-airplane" size="24" />
    </button>
  </footer>
</template>

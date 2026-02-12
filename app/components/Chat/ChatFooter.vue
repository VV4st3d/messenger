<script setup lang="ts">
import Icon from '../ui/Icon.vue';

const messageText = defineModel<string>();

interface IEmits {
  (e: 'send-message' | 'start-typing'): void;
}
const emit = defineEmits<IEmits>();
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
      @input="emit('start-typing')"
      @keydown.enter.exact.prevent="emit('send-message')"
    />

    <button
      :disabled="!messageText?.length"
      class="disabled:opacity-50"
      @click="emit('send-message')"
    >
      <Icon name="paper-airplane" size="24" />
    </button>
  </footer>
</template>

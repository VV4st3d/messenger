<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import Icon from '../ui/Icon.vue';

const messageText = defineModel<string>();
const FILE_INPUT = 'file-input';

const fileInput = useTemplateRef<HTMLInputElement>(FILE_INPUT);

const attachedFile = ref<File | null>(null);

const emit = defineEmits<{
  (e: 'send-message' | 'start-typing'): void;
  (e: 'upload-file', file: File): void;
}>();

const handleOpenFileUploader = () => {
  fileInput.value?.click();
};

const handleSetFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    attachedFile.value = input.files[0];
  }
};

const sendMessage = () => {
  if (!attachedFile.value) {
    return emit('send-message');
  }
  emit('upload-file', attachedFile.value);
};
</script>

<template>
  <footer
    class="chat-input-container flex items-center gap-2 p-3 bg-[var(--bg-secondary)] border-t border-[var(--border)]"
  >
    <button
      class="p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition"
      @click="handleOpenFileUploader"
    >
      <Icon name="paper-clip" size="24" />
    </button>

    <input
      :ref="FILE_INPUT"
      type="file"
      accept="image/*,video/*,.pdf"
      class="hidden"
      @change="handleSetFile"
    >

    <textarea
      v-model="messageText"
      placeholder="Напишите сообщение..."
      rows="1"
      class="flex-1 resize-none bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
      @input="emit('start-typing')"
      @keydown.enter.exact.prevent="sendMessage"
    />

    <button
      :disabled="!messageText?.trim()"
      class="p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--accent)]/10 transition"
      @click="sendMessage"
    >
      <Icon name="paper-airplane" size="24" />
    </button>
  </footer>
</template>

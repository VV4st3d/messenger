<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import Icon from '../ui/Icon.vue';
import Popover from '../ui/Popover.vue';
import type { TMessageType } from '~/shared/types';

const messageText = defineModel<string>();
const FILE_INPUT = 'file-input';

const fileInput = useTemplateRef<HTMLInputElement>(FILE_INPUT);
const imageUrl = ref<string | null>(null);

const attachedFile = ref<File | null>(null);

const emit = defineEmits<{
  (e: 'start-typing'): void;
  (e: 'upload-file', file: File): void;
  (e: 'send-message', content?: string, type?: TMessageType): void;
}>();

const handleOpenFileUploader = () => {
  fileInput.value?.click();
};

const handleSetFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    attachedFile.value = file;
    if (attachedFile.value.type.startsWith('image')) {
      imageUrl.value = URL.createObjectURL(attachedFile.value);
    }
  }
};

const clearFile = () => {
  attachedFile.value = null;
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = null;
  }
};

const sendMessage = () => {
  if (!attachedFile.value) {
    return emit('send-message');
  }
  emit('upload-file', attachedFile.value);
  clearFile();
};
</script>

<template>
  <footer
    class="chat-input-container flex-col border-[var(--border)] bg-[var(--bg-secondary)]"
  >
    <div
      v-if="attachedFile"
      class="relative inline-block mb-3 bg-[var(--bg-tertiary)] rounded-lg h-20 w-20"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="h-full w-full object-cover rounded-md border border-[var(--border)]"
      >
      <div v-else class="flex items-center gap-2 text-sm">
        <Icon name="document" size="20" />
        <span class="truncate max-w-[150px]">{{ attachedFile.name }}</span>
      </div>

      <button
        class="absolute -top-1 -right-1 transition deleteFile"
        @click="clearFile"
      >
        <Icon name="x-mark" size="16" />
      </button>
    </div>
    <div class="flex items-center gap-4">
      <button @click="handleOpenFileUploader">
        <Icon name="paper-clip" size="24" />
      </button>
      <input
        :ref="FILE_INPUT"
        type="file"
        accept="image/*,video/*,.pdf"
        class="hidden"
        @change="handleSetFile"
      >
      <div class="relative flex-1 resize-none flex items-center">
        <textarea
          v-model="messageText"
          placeholder="Напишите сообщение..."
          rows="1"
          class="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
          @input="emit('start-typing')"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <Popover placement="top" align="right" class="absolute right-3">
          <template #button>
            <button class="open-emoji-panel">
              <Icon
                is-not-default
                name="iconoir:emoji"
                size="20"
                class="hover:text-[var(--accent)]"
              />
            </button>
          </template>
          <template #content>
            <StickerPanel
              @send-sticker="
                (stickerName) => emit('send-message', stickerName, 'sticker')
              "
            />
          </template>
        </Popover>
      </div>

      <button
        :disabled="!messageText?.trim() && !attachedFile"
        @click="sendMessage"
      >
        <Icon name="paper-airplane" size="24" />
      </button>
    </div>
  </footer>
</template>

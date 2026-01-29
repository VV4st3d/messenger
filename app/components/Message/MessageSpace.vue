<script setup lang="ts">
import { useCurrentChatStore } from '#imports';
import { computed, nextTick, useTemplateRef, watch } from 'vue';
import type { IMessage } from '~/shared/types';

const props = defineProps<{
  messages: IMessage[];
}>();

const ANCHOR_NAME = 'bottomRef';

const scrollAnchorRef = useTemplateRef<HTMLDivElement>(ANCHOR_NAME);

async function scrollToElement() {
  await nextTick();
  scrollAnchorRef.value?.scrollIntoView({ behavior: 'smooth' });
}

const currentChatStore = useCurrentChatStore();
const isTyping = computed(() => currentChatStore.typing?.isTyping);

watch(
  () => props.messages,
  () => {
    scrollToElement();
  },
  { deep: true },
);
</script>

<template>
  <div class="flex-1 overflow-y-auto p-6 bg-[var(--bg-primary)] relative">
    <div v-if="messages.length > 0" class="flex flex-col space-y-6">
      <MessageCard
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
      <div v-if="isTyping" class="typing-indicator">Печатает...</div>
      <div :ref="ANCHOR_NAME" style="display: hidden" />
    </div>

    <div
      v-else
      class="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
    >
      <div
        class="w-24 h-24 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6"
      >
        <UiIcon
          name="chat-bubble-left-right"
          class="w-12 h-12 text-[var(--text-tertiary)]"
        />
      </div>

      <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-3">
        Пока сообщений нет
      </h3>

      <p class="text-[var(--text-secondary)] max-w-md mb-8">
        Начните разговор! Напишите первое сообщение и сделайте этот чат живым 😊
      </p>
    </div>
  </div>
</template>

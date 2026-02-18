<script setup lang="ts">
import { computed } from 'vue';
import { formatLastMessageDate } from '#imports';
import type { IMessage } from '~/shared/types';
import Icon from '../ui/Icon.vue';

const props = defineProps<{
  message: IMessage;
  isAnchor?: boolean;
  userId: string | undefined;
  isGeneratingSummary?: { isGenerating: boolean; id: string | null };
}>();

const formattedTime = computed(() =>
  formatLastMessageDate(props.message.createdAt),
);

const isOwn = computed(() => props.message.sender?.id === props.userId);

const emit = defineEmits<{
  (e: 'context', payload: { event: MouseEvent; message: IMessage }): void;
}>();

const onRightClick = (event: MouseEvent) => {
  emit('context', { event, message: props.message });
};

const isGenerating = computed(
  () =>
    props.isGeneratingSummary?.isGenerating &&
    props.isGeneratingSummary.id === props.message.id,
);
</script>

<template>
  <div
    class="flex flex-col message-card"
    :class="{ 'highlight-active': isAnchor }"
  >
    <div
      v-if="!isOwn"
      class="flex items-end gap-2 max-w-[85%] sm:max-w-[72%] pr-1"
      @contextmenu.prevent="onRightClick"
    >
      <div
        class="message-other flex flex-col gap-1.5 rounded-2xl px-3.5 py-2.5 bg-gray-100 dark:bg-gray-800 transition-all duration-200"
        :class="{
          'has-image px-1.5 py-1.5 rounded-xl': message.filePath,
          'generating-summary': isGenerating,
        }"
      >
        <p
          v-if="message.content"
          class="message-text text-[15px] leading-5 whitespace-pre-wrap break-words"
        >
          {{ message.content }}
        </p>

        <div
          v-if="message.filePath"
          class="message-image mt-1 mb-1 overflow-hidden rounded-xl max-w-[320px]"
        >
          <img
            :src="`http://localhost:8080/uploads${message.filePath}`"
            alt="attachment"
            class="w-full h-auto object-cover block"
          >
        </div>

        <div
          class="message-meta flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5"
        >
          <span class="time min-w-[36px] text-right opacity-85">{{
            formattedTime
          }}</span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex items-end justify-end max-w-[85%] sm:max-w-[72%] ml-auto pl-1"
      @contextmenu.prevent="onRightClick"
    >
      <div
        class="message-own flex flex-col gap-1.5 rounded-2xl px-3.5 py-2.5 bg-blue-100 dark:bg-blue-900/40 transition-all duration-200"
        :class="{
          'has-image px-1.5 py-1.5 rounded-xl': message.filePath,
          'generating-summary': isGenerating,
        }"
      >
        <p
          v-if="message.content"
          class="message-text text-[15px] leading-5 whitespace-pre-wrap break-words"
        >
          {{ message.content }}
        </p>

        <div
          v-if="message.filePath"
          class="message-image mt-1 mb-1 overflow-hidden rounded-xl max-w-[320px]"
        >
          <img
            :src="`http://localhost:8080/uploads${message.filePath}`"
            alt="attachment"
            class="w-full h-auto object-cover block"
          >
        </div>

        <div
          class="message-meta flex items-center justify-end gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5"
        >
          <span class="time min-w-[36px] text-right opacity-85">{{
            formattedTime
          }}</span>
          <Icon
            v-if="message.isRead"
            is-not-default
            name="solar:check-read-linear"
            class="status text-blue-600 dark:text-blue-400 opacity-100 w-4 h-4"
          />
          <Icon
            v-else
            is-not-default
            name="lineicons:check"
            class="status opacity-70 w-4 h-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.generating-summary {
  background: linear-gradient(
    270deg,
    var(--accent),
    var(--accent-hover),
    #8b5cf6,
    var(--accent)
  );
  background-size: 300% 300%;
  animation: accentGradient 6s ease infinite;
}

.highlight-active .message-own,
.highlight-active .message-other {
  animation: highlightSubtle 2s ease-in-out forwards;
  z-index: 1;
}

@keyframes highlightSubtle {
  0% {
    filter: brightness(1);
    box-shadow: 0 0 0 rgba(99, 102, 241, 0);
  }
  30% {
    filter: brightness(1.15);
    box-shadow: 0 0 14px rgba(99, 102, 241, 0.35);
  }
  100% {
    filter: brightness(1);
    box-shadow: 0 0 0 rgba(99, 102, 241, 0);
  }
}

@keyframes accentGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.has-image .message-meta {
  position: absolute;
  bottom: 38px;
  right: 12px;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  backdrop-filter: blur(1.5px);
}
</style>

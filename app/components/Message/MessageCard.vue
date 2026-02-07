<script setup lang="ts">
import { computed } from 'vue';
import { formatLastMessageDate } from '#imports';
import type { IMessage } from '~/shared/types';
import Icon from '../ui/Icon.vue';

const props = defineProps<{
  message: IMessage;
  isAnchor?: boolean;
  userId: string | undefined;
}>();

const formattedTime = computed(() =>
  formatLastMessageDate(props.message.createdAt),
);

const isOwn = computed(() => props.message.sender?.id === props.userId);
</script>

<template>
  <div
    class="flex flex-col message-card"
    :class="{ 'highlight-active': isAnchor }"
  >
    <div v-if="!isOwn" class="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
      <div class="flex flex-col">
        <div
          class="message-other relative p-3 rounded-2xl rounded-bl-none shadow-sm bg-[var(--message-other)] border border-[var(--border-color)] transition-all duration-300"
        >
          <p
            class="text-[var(--text-primary)] leading-relaxed break-words whitespace-pre-wrap overflow-hidden"
          >
            {{ message.content }}
          </p>

          <div class="flex justify-end mt-1">
            <span
              class="text-[10px] uppercase font-medium text-[var(--text-tertiary)]"
            >
              {{ formattedTime }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex items-end justify-end gap-2 max-w-[85%] sm:max-w-[70%] ml-auto"
    >
      <div class="flex flex-col items-end">
        <div
          class="message-own relative p-3 rounded-2xl rounded-br-none shadow-md bg-[var(--message-own)] text-white transition-all duration-300"
        >
          <p
            class="leading-relaxed break-words whitespace-pre-wrap overflow-hidden"
          >
            {{ message.content }}
          </p>

          <div class="flex justify-end items-center gap-1 mt-1">
            <span class="text-[10px] uppercase font-medium opacity-70">
              {{ formattedTime }}
            </span>
            <Icon
              v-if="message.isRead"
              is-not-default
              name="solar:check-read-linear"
            />
            <Icon v-else is-not-default name="lineicons:check" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.break-words {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
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
    filter: brightness(1.2);
    box-shadow: 0 0 12px 2px rgba(99, 102, 241, 0.3);
  }
  100% {
    filter: brightness(1);
    box-shadow: 0 0 0 rgba(99, 102, 241, 0);
  }
}
</style>

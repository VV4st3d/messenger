<script setup lang="ts">
import { computed, useCompanion } from '#imports';
import type { IChat, ITyping } from '~/shared/types';
import TypingIndicator from '../common/Typing/TypingIndicator.vue';

interface IProps {
  chat: IChat | undefined;
  typing: ITyping | undefined;
}

const props = defineProps<IProps>();
const companion = useCompanion(() => props.chat);
const isCompanionOnline = computed(() =>
  companion.value?.isOnline ? 'Онлайн' : 'Оффлайн',
);

const isTyping = computed(() => props.typing?.isTyping);
</script>

<template>
  <header
    class="bg-[var(--bg-secondary)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <button
        class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition md:hidden"
      >
        <UiIcon name="arrow-left" size="24" />
      </button>
      <div class="relative">
        <CommonAvatar size="md" :online="companion?.isOnline" />
      </div>
      <div>
        <h2 class="font-semibold text-lg truncate max-w-[200px]">
          {{ chat?.name }}
        </h2>
        <TypingIndicator v-if="isTyping" :show="isTyping" />
        <p v-else class="text-xs text-[var(--text-secondary)]">
          {{ isCompanionOnline }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button
        class="text-[var(--text-secondary)] hover:text-[var(--accent)] transition"
      >
        <UiIcon name="ellipsis-horizontal" size="20" />
      </button>
    </div>
  </header>
</template>

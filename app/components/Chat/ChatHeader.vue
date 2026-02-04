<script setup lang="ts">
import { computed, useCompanion } from '#imports';
import type { IChat, IMessage, ITyping } from '~/shared/types';
import TypingIndicator from '../common/Typing/TypingIndicator.vue';
import SearchDropdown from '../common/SearchDropdown/SearchDropdown.vue';
import Avatar from '../common/Avatar/Avatar.vue';
import Icon from '../ui/Icon.vue';

interface IProps {
  chat: IChat | undefined;
  chatId: string;
  typing: ITyping | undefined;
  isSearching: boolean;
  foundMessages: IMessage[];
  onOpenSearchingDropdown: () => void;
  handleFindMessage: (
    chatId: string,
    query: { query: string },
  ) => Promise<void>;
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
    class="relative bg-[var(--bg-secondary)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <button
        class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition md:hidden"
      >
        <Icon name="arrow-left" size="24" />
      </button>
      <div class="relative">
        <Avatar size="md" :online="companion?.isOnline" />
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
        <Icon name="ellipsis-horizontal" size="24" />
      </button>
      <button
        class="text-[var(--text-secondary)] hover:text-[var(--accent)] transition"
        @click.stop="onOpenSearchingDropdown"
      >
        <Icon name="magnifying-glass" size="24" />
      </button>
      <SearchDropdown
        v-if="isSearching"
        :chat-id="chatId"
        :found-messages="foundMessages"
        :handle-find-message="handleFindMessage"
        @click.stop
      />
    </div>
  </header>
</template>

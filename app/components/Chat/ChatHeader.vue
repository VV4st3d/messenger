<script setup lang="ts">
import {
  computed,
  getStatus,
  nextTick,
  useCompanion,
  useTemplateRef,
  watch,
} from '#imports';
import type { IChat, IMessage, ITyping } from '~/shared/types';
import TypingIndicator from '../ui/TypingIndicator.vue';
import Avatar from '../ui/Avatar/Avatar.vue';
import Icon from '../ui/Icon.vue';
import SearchDropdown from '../SearchDropdown/SearchDropdown.vue';

interface IProps {
  chat: IChat | null;
  chatId: string;
  typing: ITyping | null;
  isSearching: boolean;
  foundMessages: IMessage[];
}

interface IEmits {
  (e: 'search' | 'open-search-dropdown'): void;
  (e: 'message-click', chatId: string): void;
}

const SEARCH_INPUT = 'searchInputField' as const;
const searchInputField = useTemplateRef<HTMLInputElement>(SEARCH_INPUT);

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const queryInput = defineModel<string>();

const companion = useCompanion(() => props.chat);

const status = getStatus(() => companion.value?.isOnline);

const isTyping = computed(() => props.typing?.isTyping);

watch(
  () => props.isSearching,
  async (value) => {
    if (value) {
      await nextTick();
      searchInputField.value?.focus();
    }
  },
);
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
          {{ status }}
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
        @click.stop="emit('open-search-dropdown')"
      >
        <Icon name="magnifying-glass" size="24" />
      </button>
      <SearchDropdown
        v-if="isSearching"
        class="rounded-xl"
        :messages="foundMessages"
        @message-click="(chatId) => emit('message-click', chatId)"
      >
        <div class="p-3 border-b border-[var(--border)]">
          <div
            class="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2"
          >
            <Icon
              name="magnifying-glass"
              size="16"
              class="text-[var(--text-secondary)]"
            />
            <input
              :ref="SEARCH_INPUT"
              v-model="queryInput"
              type="text"
              placeholder="Поиск..."
              class="w-full bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
              @input="emit('search')"
            >
          </div>
        </div>
      </SearchDropdown>
    </div>
  </header>
</template>

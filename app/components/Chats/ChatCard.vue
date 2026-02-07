<script setup lang="ts">
import { computed, formatLastMessageDate } from '#imports';
import { useCompanion } from '~/composables/useCompanion';
import type { IChat, ITyping } from '~/shared/types';
import TypingIndicator from '../ui/TypingIndicator.vue';
import Avatar from '../ui/Avatar/Avatar.vue';

const props = defineProps<{ chat: IChat; typing: ITyping | null }>();

const companion = useCompanion(() => props.chat);

const formattedTime = computed(
  () =>
    props.chat.lastMessage?.createdAt &&
    formatLastMessageDate(props.chat.lastMessage.createdAt),
);
</script>

<template>
  <div
    class="flex items-center gap-3 hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
  >
    <Avatar
      size="md"
      :src="companion?.avatarUrl"
      :online="companion?.isOnline"
      class="flex-shrink-0"
    />

    <div class="flex-1 min-w-0 flex flex-col justify-center">
      <div class="flex justify-between items-baseline gap-2">
        <span class="font-semibold truncate text-[var(--text-primary)]">
          {{ chat.name }}
        </span>

        <span
          v-if="chat.lastMessage"
          class="text-xs text-[var(--text-tertiary)] whitespace-nowrap"
        >
          {{ formattedTime }}
        </span>
      </div>

      <div
        v-if="chat.lastMessage"
        class="text-sm text-[var(--text-secondary)] truncate leading-tight"
      >
        <TypingIndicator
          v-if="typing?.isTyping && typing.chatId === chat.id"
          :show="typing.isTyping"
        />

        <span v-else>
          {{ chat.lastMessage.content }}
        </span>
      </div>
    </div>
  </div>
</template>

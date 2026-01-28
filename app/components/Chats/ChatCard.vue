<script setup lang="ts">
import { formatLastMessageDate } from '#imports';
import { useCompanion } from '~/composables/useCompanion';
import type { IChat } from '~/shared/types';

const props = defineProps<{ chat: IChat }>();

const companion = useCompanion(() => props.chat);
</script>

<template>
  <div
    class="flex items-center gap-3 hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
  >
    <CommonAvatar
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
          {{ formatLastMessageDate(chat.lastMessage.createdAt) }}
        </span>
      </div>

      <div
        v-if="chat.lastMessage"
        class="text-sm text-[var(--text-secondary)] truncate leading-tight"
      >
        {{ chat.lastMessage.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IFriend } from '~/shared/types';

const props = defineProps<{
  friend: IFriend;
}>();

const userStatus = computed(() =>
  props.friend.isOnline ? 'Онлайн' : 'Был недавно',
);
</script>

<template>
  <div
    class="friend-item flex items-center gap-4 p-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
  >
    <div class="relative flex-shrink-0">
      <CommonAvatar
        :src="friend.avatarUrl"
        size="md"
        :online="friend.isOnline"
      />
    </div>

    <div class="flex-1 min-w-0">
      <div class="font-medium truncate text-[var(--text-primary)]">
        {{ friend.displayName }}
      </div>
      <div class="text-sm text-[var(--text-secondary)] truncate">
        {{ userStatus }}
      </div>
    </div>

    <div class="flex items-center gap-1">
      <button
        class="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition p-1.5 rounded-full hover:bg-[rgba(var(--accent),0.1)] cursor-pointer"
      >
        <UiIcon name="chat-bubble-left-right" size="20" />
      </button>
      <button
        class="text-[var(--text-tertiary)] hover:text-[var(--danger)] transition p-1.5 rounded-full hover:bg-[rgba(var(--danger),0.1)] cursor-pointer"
      >
        <UiIcon name="trash" size="20" />
      </button>
    </div>
  </div>
</template>

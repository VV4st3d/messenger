<script setup lang="ts">
import type { IFriend, IFriendEvent, TFriendEmitNames } from '~/shared/types';
import Avatar from '../ui/Avatar/Avatar.vue';
import Icon from '../ui/Icon.vue';
import { getStatus } from '#imports';

const props = defineProps<{
  friend: IFriend;
  emits: IFriendEvent[];
}>();

interface IEmits {
  (e: TFriendEmitNames, id: string): void;
}

const status = getStatus(() => props.friend.isOnline);
const emit = defineEmits<IEmits>();
</script>

<template>
  <div
    class="friend-item flex items-center gap-4 p-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
  >
    <div class="relative flex-shrink-0">
      <Avatar :src="friend.avatarUrl" size="md" :online="friend.isOnline" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="font-medium truncate text-[var(--text-primary)]">
        {{ friend.displayName }}
      </div>
      <div class="text-sm text-[var(--text-secondary)] truncate">
        {{ status }}
      </div>
    </div>

    <div v-if="emits" class="flex items-center gap-1">
      <button
        v-for="event in emits"
        :key="event.name"
        class="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition p-1.5 rounded-full hover:bg-[rgba(var(--accent),0.1)] cursor-pointer"
        :class="[
          event.isDanger
            ? 'hover:text-[var(--danger)] hover:bg-[rgba(var(--danger),0.1)]'
            : 'hover:text-[var(--accent)] hover:bg-[rgba(var(--accent),0.1)]',
        ]"
        @click="emit(event.name, friend.id)"
      >
        <Icon :name="event.iconName" size="20" />
      </button>
    </div>
  </div>
</template>

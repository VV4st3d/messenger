<script setup lang="ts">
import type { IFoundUser } from '~/shared/types';
import Avatar from '../ui/Avatar/Avatar.vue';
import Icon from '../ui/Icon.vue';

interface IProps {
  foundUsers: IFoundUser[];
}
interface IEmits {
  (e: 'open-chat' | 'add-friend', otherUserId: string): void;
}
defineProps<IProps>();
const emit = defineEmits<IEmits>();
</script>

<template>
  <div class="max-h-[200px] overflow-y-auto">
    <div
      v-for="user in foundUsers"
      :key="user.id"
      class="flex items-center justify-between gap-3 px-4 py-2 hover:bg-[var(--bg-secondary)] transition"
    >
      <div class="flex items-center gap-3 overflow-hidden">
        <Avatar :src="user.avatarUrl" />
        <span class="text-sm font-medium truncate">
          {{ user.displayName }}
        </span>
      </div>

      <div class="flex-shrink-0">
        <button
          v-if="!user.isFriend"
          class="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition p-1.5 rounded-full hover:bg-[rgba(var(--accent),0.1)] cursor-pointer"
          @click="emit('add-friend', user.id)"
        >
          <Icon name="user-plus" size="20" />
        </button>

        <button
          v-else
          class="text-[var(--text-tertiary)] hover:text-[var(--accent)] transition p-1.5 rounded-full hover:bg-[rgba(var(--accent),0.1)] cursor-pointer"
          @click="emit('open-chat', user.id)"
        >
          <Icon name="chat-bubble-left-right" size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

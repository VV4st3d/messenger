<script setup lang="ts">
import type { IFriend } from '~/shared/types';
import Icon from '../ui/Icon.vue';

defineProps<{ friends: IFriend[] }>();
</script>
<template>
  <div class="divide-y divide-[var(--border-subtle)]">
    <FriendItem
      v-for="friend in friends"
      :key="friend.id"
      :friend="friend"
      :online="friend.isOnline"
    />
    <div
      v-if="friends.length === 0"
      class="flex flex-col items-center justify-center h-full py-12 text-[var(--text-tertiary)]"
    >
      <Icon name="users" class="w-16 h-16 mb-4 opacity-50" />
      <p class="text-lg font-medium">У тебя пока нет друзей</p>
      <p class="text-sm mt-2 text-center max-w-xs">
        Отправь кому-нибудь заявку в друзья, чтобы начать общение
      </p>
    </div>
  </div>
</template>

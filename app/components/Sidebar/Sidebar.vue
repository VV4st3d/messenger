<script setup lang="ts">
import { useNuxtApp } from '#app';
import { storeToRefs, useAuthStore, useFriendsStore } from '#imports';
import { computed, onMounted, ref } from 'vue';
import type { TTabs } from './types';
import FriendList from '../Friend/FriendList.vue';

const activeTab = ref<TTabs>('chats');

const authStore = useAuthStore();
const friendsStore = useFriendsStore();

const friends = computed(() => friendsStore.friends);

const { user, isOnline } = storeToRefs(authStore);
const { $api } = useNuxtApp();

const additionalClassses = (currentTab: TTabs) =>
  activeTab.value === currentTab
    ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]';

const handleGetFriends = async () => {
  try {
    const { data } = await $api.friend.getFriends();
    friendsStore.setFriends(data);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  handleGetFriends();
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-[var(--border)]">
      <input
        type="text"
        placeholder="Поиск чатов или друзей..."
        class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition placeholder:text-[var(--text-tertiary)]"
      >
    </div>

    <div class="flex border-b border-[var(--border)]">
      <button
        class="flex-1 py-4 text-center font-medium text-sm transition-colors"
        :class="additionalClassses('chats')"
        @click="activeTab = 'chats'"
      >
        Чаты
      </button>
      <button
        class="flex-1 py-4 text-center font-medium text-sm transition-colors"
        :class="additionalClassses('friends')"
        @click="activeTab = 'friends'"
      >
        Друзья
      </button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div
        v-if="activeTab === 'chats'"
        class="divide-y divide-[var(--border-subtle)]"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="chat-item flex items-center gap-4 p-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
          :class="{
            'bg-[rgba(var(--accent),0.12)] border-l-3 border-[var(--accent)]':
              i === 1,
          }"
        >
          <div class="relative">
            <div
              class="avatar w-12 h-12 rounded-full bg-[var(--bg-tertiary)]"
            />
            <div class="avatar-status online" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium truncate">Имя собеседника</div>
            <div class="text-sm text-[var(--text-secondary)] truncate">
              Последнее сообщение...
            </div>
          </div>
          <div class="text-xs text-[var(--text-tertiary)]">14:32</div>
        </div>
      </div>

      <div
        v-if="activeTab === 'friends'"
        class="p-4 text-[var(--text-secondary)]"
      >
        <FriendList :friends="friends" />
      </div>
    </div>

    <div
      class="p-4 border-t border-[var(--border)] flex items-center gap-3 bg-[var(--bg-tertiary)]"
    >
      <div class="relative">
        <CommonAvatar :src="user?.avatarUrl" :size="'sm'" :online="isOnline" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-medium truncate">{{ user?.displayName }}</div>
        <div class="text-xs text-[var(--text-tertiary)]">
          {{ isOnline ? 'Онлайн' : 'Оффлайн' }}
        </div>
      </div>
      <button
        class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
      >
        <UiIcon name="ellipsis-horizontal" size="24" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-item {
  @apply p-4 flex items-center gap-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer;
}
</style>

<script setup lang="ts">
import {
  storeToRefs,
  useAuthStore,
  useCurrentChatStore,
  useFriendsStore,
} from '#imports';
import { computed, onMounted, ref } from 'vue';
import type { TSidebarTabs } from './types';
import FriendList from '../Friend/FriendList.vue';
import { useChatsStore } from '~/stores/chats';

const activeTab = ref<TSidebarTabs>('chats');

const authStore = useAuthStore();
const friendsStore = useFriendsStore();
const chatStore = useChatsStore();
const currentChatStore = useCurrentChatStore();

const chats = computed(() => chatStore.chats);

const friends = computed(() => friendsStore.friends);

const { user, isOnline } = storeToRefs(authStore);

const typing = computed(() => currentChatStore.typing);

const isUserOnline = computed(() => (isOnline ? 'Онлайн' : 'Оффлайн'));

const additionalClassses = (currentTab: TSidebarTabs) =>
  activeTab.value === currentTab
    ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]';

const handleGetFriends = async () => {
  try {
    await friendsStore.getFriendsHandler();
  } catch (error) {
    console.log(error);
  }
};

const handleGetChats = async () => {
  try {
    await useChatsStore().getChatsHandler();
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  handleGetFriends();
  handleGetChats();
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
        <Chats :typing="typing" :chats="chats" />
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
          {{ isUserOnline }}
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

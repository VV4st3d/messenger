<script setup lang="ts">
import {
  getStatus,
  navigateTo,
  storeToRefs,
  useAsyncData,
  useAuthStore,
  useCurrentChatStore,
  useDebounce,
  useFriendsStore,
  useNuxtApp,
} from '#imports';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { TSidebarTabs } from './types';
import FriendList from '../Friend/FriendList.vue';
import { useChatsStore } from '~/stores/chats';
import Icon from '../ui/Icon.vue';
import { SEARCH_DELAY_MS } from '~/shared/const/delay';
import SearchDropdown from '../SearchDropdown/SearchDropdown.vue';
import Avatar from '../ui/Avatar/Avatar.vue';
import { ROUTES } from '~/shared/const';
import Dropdown from '../ui/Dropdown.vue';
import { contextEvents } from './const';

const activeTab = ref<TSidebarTabs>('chats');
const queryInput = ref('');
const isSidebarDropdownOpen = ref(false);
const userContextMenu = ref<{
  isVisible: boolean;
  x: number;
  y: number;
}>({
  isVisible: false,
  x: 0,
  y: 0,
});

const authStore = useAuthStore();
const friendsStore = useFriendsStore();
const chatStore = useChatsStore();
const currentChatStore = useCurrentChatStore();
const { $api } = useNuxtApp();

const { user, isOnline } = storeToRefs(authStore);
const { friends, incomingRequests, outgoingRequests } =
  storeToRefs(friendsStore);

const chats = computed(() => chatStore.chats);
const typing = computed(() => currentChatStore.typing);
const status = getStatus(() => isOnline.value);
const globalFoundMessages = computed(() => chatStore.globalFoundMessage);

const getTabClasses = (currentTab: TSidebarTabs) =>
  activeTab.value === currentTab
    ? 'border-b-2 border-[var(--accent)] text-[var(--accent)]'
    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]';

const getOrCreateChatHandler = async (otherUserId: string): Promise<void> => {
  try {
    const { data } = await $api.chats.createOrGetPrivateChat({
      otherUserId,
    });
    navigateTo(ROUTES.getRouteChat(data.id));
  } catch (error) {
    console.log('Ошибка при создании/поиске чата', error);
  }
};

const handleSearchGlobalMessagesDebounced = useDebounce(
  chatStore.fetchGlobalMessages,
  SEARCH_DELAY_MS,
);

const handleSearchFriendsDebounced = useDebounce(
  friendsStore.fetchUsers,
  SEARCH_DELAY_MS,
);

const handleSearchGlobalMessages = () => {
  isSidebarDropdownOpen.value = true;
  handleSearchGlobalMessagesDebounced({ query: queryInput.value });
  handleSearchFriendsDebounced({ q: queryInput.value });
};

const foundMessageHandler = async (chatId: string): Promise<void> => {
  await currentChatStore.fetchMessagesById(chatId);
  isSidebarDropdownOpen.value = false;
};

const onCloseEvents = () => {
  isSidebarDropdownOpen.value = false;
  userContextMenu.value.isVisible = false;
};

const handleOpenPopup = (e: MouseEvent) => {
  userContextMenu.value = {
    x: e.clientX,
    y: e.clientY,
    isVisible: true,
  };
};

await useAsyncData(
  `tab-content-${activeTab.value}`,
  async () => {
    switch (activeTab.value) {
      case 'chats':
        await chatStore.fetchChats();
        return true;
      case 'friends':
        await Promise.all([
          friendsStore.fetchFriends(),
          friendsStore.fetchFriendsRequests(),
        ]);
        return true;
      default: {
        const _exhaustiveCheck: never = activeTab.value;
        return _exhaustiveCheck;
      }
    }
  },
  { watch: [activeTab], immediate: true },
);

onMounted(() => {
  window.addEventListener('click', onCloseEvents);
});

onUnmounted(() => {
  window.removeEventListener('click', onCloseEvents);
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="relative p-4 border-b border-[var(--border)]">
      <input
        v-model="queryInput"
        type="text"
        placeholder="Поиск сообщений"
        class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition placeholder:text-[var(--text-tertiary)]"
        @input="handleSearchGlobalMessages"
      >
      <SearchDropdown
        v-if="isSidebarDropdownOpen"
        :messages="globalFoundMessages"
        :found-users="friendsStore.foundUsers"
        @message-click="foundMessageHandler"
        @open-chat="getOrCreateChatHandler"
        @add-friend="friendsStore.sendRequest"
      />
    </div>

    <div class="flex border-b border-[var(--border)]">
      <button
        class="flex-1 py-4 text-center font-medium text-sm transition-colors"
        :class="getTabClasses('chats')"
        @click="activeTab = 'chats'"
      >
        Чаты
      </button>
      <button
        class="flex-1 py-4 text-center font-medium text-sm transition-colors"
        :class="getTabClasses('friends')"
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
        <FriendList
          :incoming-requests="incomingRequests"
          :outgoing-requests="outgoingRequests"
          :friends="friends"
          @open-chat="getOrCreateChatHandler"
          @accept="friendsStore.acceptRequest"
          @reject="friendsStore.rejectRequest"
          @cancel="friendsStore.cancelRequest"
          @remove-friend="friendsStore.removeFriend"
        />
      </div>
    </div>

    <div
      class="p-4 border-t border-[var(--border)] flex items-center gap-3 bg-[var(--bg-tertiary)]"
    >
      <div class="relative">
        <Avatar :src="user?.avatarUrl" :size="'sm'" :online="isOnline" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-medium truncate">{{ user?.displayName }}</div>
        <div class="text-xs text-[var(--text-tertiary)]">
          {{ status }}
        </div>
      </div>
      <button
        class="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
        @click.stop="handleOpenPopup"
      >
        <Icon name="ellipsis-horizontal" size="24" />
      </button>
      <Dropdown
        :is-visible="userContextMenu.isVisible"
        :position-x="userContextMenu.x"
        :position-y="userContextMenu.y"
        :events="contextEvents"
        vertical-side="top"
        side="left"
      />
    </div>
  </div>
</template>

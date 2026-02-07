<script setup lang="ts">
import {
  getStatus,
  storeToRefs,
  useAuthStore,
  useCurrentChatStore,
  useDebounce,
  useFriendsStore,
} from '#imports';
import { computed, ref, watch } from 'vue';
import type { TSidebarTabs } from './types';
import FriendList from '../Friend/FriendList.vue';
import { useChatsStore } from '~/stores/chats';
import Icon from '../ui/Icon.vue';
import { SEARCH_MESSAGE_DELAY_MS } from '~/shared/const/delay';
import SearchDropdown from '../ui/SearchDropdown.vue';
import Avatar from '../ui/Avatar/Avatar.vue';

const activeTab = ref<TSidebarTabs>('chats');
const queryInput = ref<string>('');
const isSidebarDropdownOpen = ref<boolean>(false);

const authStore = useAuthStore();
const friendsStore = useFriendsStore();
const chatStore = useChatsStore();
const currentChatStore = useCurrentChatStore();

const { user, isOnline } = storeToRefs(authStore);

const chats = computed(() => chatStore.chats);
const friends = computed(() => friendsStore.friends);
const typing = computed(() => currentChatStore.typing);
const status = getStatus(() => isOnline.value);
const foundGlobalMessages = computed(() => chatStore.globalFoundMessage);

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
    await chatStore.getChatsHandler();
  } catch (error) {
    console.log(error);
  }
};

const handleSearchGlobalMessagesDebounced = useDebounce(
  chatStore.handleGetGlobalMessages,
  SEARCH_MESSAGE_DELAY_MS,
);

const handleSearchGlobalMessages = () => {
  isSidebarDropdownOpen.value = true;
  handleSearchGlobalMessagesDebounced({ query: queryInput.value });
};

const onClickFoundMessage = async (chatId: string): Promise<void> => {
  await currentChatStore.handleMessagesById(chatId);
  isSidebarDropdownOpen.value = false;
};

watch(
  activeTab,
  (tab) => {
    switch (tab) {
      case 'chats':
        handleGetChats();
        break;
      case 'friends':
        handleGetFriends();
        break;
      default: {
        const _exhaustiveCheck: never = tab;
        return _exhaustiveCheck;
      }
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex flex-col h-full" @click="isSidebarDropdownOpen = false">
    <div class="relative p-4 border-b border-[var(--border)]">
      <input
        v-model="queryInput"
        type="text"
        placeholder="Поиск сообщений"
        class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition placeholder:text-[var(--text-tertiary)]"
        @input="handleSearchGlobalMessages"
      >
      <SearchDropdown
        v-if="foundGlobalMessages.length > 0 && isSidebarDropdownOpen"
        :on-message-click="onClickFoundMessage"
        :found-messages="foundGlobalMessages"
      />
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
      >
        <Icon name="ellipsis-horizontal" size="24" />
      </button>
    </div>
  </div>
</template>

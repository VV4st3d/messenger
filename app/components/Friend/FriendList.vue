<script setup lang="ts">
import type { IFriend, IFriendIncoming, IFriendOutgoing } from '~/shared/types';
import FriendItem from './FriendItem.vue';
import Icon from '../ui/Icon.vue';

interface IProps {
  friends: IFriend[];
  incomingRequests: IFriendIncoming[];
  outgoingRequests: IFriendOutgoing[];
}

interface IEmits {
  (
    e: 'accept' | 'reject' | 'cancel' | 'open-chat' | 'remove-friend',
    id: string,
  ): void;
}
defineProps<IProps>();
const emit = defineEmits<IEmits>();
</script>
<template>
  <div class="flex flex-col h-full divide-y divide-[var(--border-subtle)]">
    <div class="p-4">
      <div class="flex items-center gap-2 mb-3">
        <Icon name="user-plus" class="w-5 h-5 text-[var(--accent)]" />
        <h3
          class="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
        >
          Входящие заявки
        </h3>
        <span
          v-if="incomingRequests.length > 0"
          class="text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full"
        >
          {{ incomingRequests.length }}
        </span>
      </div>

      <div
        v-if="incomingRequests.length === 0"
        class="text-sm text-[var(--text-tertiary)] italic"
      >
        Нет новых заявок
      </div>

      <div v-else class="space-y-2">
        <FriendRequestItem
          v-for="req in incomingRequests"
          :key="req.id"
          type="incoming"
          :request="req"
          subtitle="Хочет добавить вас в друзья"
          @accept="(id) => emit('accept', id)"
          @reject="(id) => emit('reject', id)"
        />
      </div>
    </div>

    <div class="p-4">
      <div class="flex items-center gap-2 mb-3">
        <Icon
          is-not-default
          name="mdi-clock"
          class="w-5 h-5 text-[var(--text-secondary)]"
        />
        <h3
          class="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
        >
          Исходящие заявки
        </h3>
        <span
          v-if="outgoingRequests.length > 0"
          class="text-xs bg-[var(--text-secondary)]/20 text-[var(--text-secondary)] px-2 py-0.5 rounded-full"
        >
          {{ outgoingRequests.length }}
        </span>
      </div>

      <div
        v-if="outgoingRequests.length === 0"
        class="text-sm text-[var(--text-tertiary)] italic"
      >
        Нет отправленных заявок
      </div>

      <div v-else class="space-y-2">
        <FriendRequestItem
          v-for="req in outgoingRequests"
          :key="req.id"
          type="outgoing"
          subtitle="Ожидание ответа"
          :request="req"
          @cancel="(id) => emit('cancel', id)"
        />
      </div>
    </div>

    <div class="flex-1 p-4">
      <div class="flex items-center gap-2 mb-3">
        <Icon name="users" class="w-5 h-5 text-[var(--accent)]" />
        <h3
          class="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]"
        >
          Друзья
        </h3>
        <span
          v-if="friends.length > 0"
          class="text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full"
        >
          {{ friends.length }}
        </span>
      </div>

      <div
        v-if="friends.length === 0"
        class="flex flex-col items-center justify-center h-full text-[var(--text-tertiary)]"
      >
        <Icon name="users" class="w-16 h-16 mb-4 opacity-50" />
        <p class="text-lg font-medium">У тебя пока нет друзей</p>
        <p class="text-sm mt-2 text-center max-w-xs">
          Отправь кому-нибудь заявку в друзья, чтобы начать общение
        </p>
      </div>

      <div v-else class="space-y-1">
        <FriendItem
          v-for="friend in friends"
          :key="friend.id"
          :friend="friend"
          @open-chat="(id) => emit('open-chat', id)"
          @remove-friend="(id) => emit('remove-friend', id)"
        />
      </div>
    </div>
  </div>
</template>

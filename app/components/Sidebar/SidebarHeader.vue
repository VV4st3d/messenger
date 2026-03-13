<script setup lang="ts">
import type {
  IFoundUser,
  IFriend,
  IFriendEvent,
  IMessage,
} from '~/shared/types';
import Modal from '../ui/Modal.vue';
import Input from '../ui/Input.vue';
import Button from '../ui/Button.vue';
import { computed } from 'vue';

interface IEmits {
  (e: 'search-global', event: InputEvent): void;
  (
    e:
      | 'open-chat'
      | 'add-friend'
      | 'message-click'
      | 'add-to-group'
      | 'remove-from-group',
    id: string,
  ): void;
  (e: 'modal-open' | 'create-group'): void;
}
interface IProps {
  isSidebarDropdownOpen: boolean;
  globalFoundMessages: IMessage[];
  foundUsers: IFoundUser[];
  friends: IFriend[];
  groupParticipants: Record<string, boolean>;
}
const queryInput = defineModel<string>('queryInput');
const groupName = defineModel<string>('groupName');
const isModalCreateGroupOpen = defineModel<boolean>('isModalCreateGroupOpen');

const emit = defineEmits<IEmits>();

const props = defineProps<IProps>();

const friendsEvents = computed(() => {
  const events: Record<string, IFriendEvent[]> = {};

  props.friends.forEach((friend) => {
    const isInvited = props.groupParticipants[friend.id] || false;
    events[friend.id] = [
      {
        iconName: isInvited ? 'x-mark' : 'plus-20',
        isDanger: isInvited,
        name: isInvited ? 'remove-from-group' : 'add-to-group',
      },
    ];
  });

  return events;
});

const openModal = () => {
  isModalCreateGroupOpen.value = true;
  emit('modal-open');
};
</script>

<template>
  <div class="flex gap-4 w-full items-center">
    <input
      v-model="queryInput"
      type="text"
      placeholder="Поиск сообщений"
      class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition placeholder:text-[var(--text-tertiary)]"
      @input="(e) => emit('search-global', e)"
    >
    <button class="hover:text-[var(--accent)]" @click="openModal">
      <Icon size="20" is-not-default name="fluent-mdl2:add-group" />
    </button>

    <Modal v-model="isModalCreateGroupOpen">
      <template #header> Создать групповой чат </template>
      <Input
        v-model="groupName"
        class="mb-3"
        placeholder="Название группы"
        type="text"
      />
      <FriendItem
        v-for="friend in friends"
        :key="friend.id"
        :emits="friendsEvents[friend.id]!"
        :friend="friend"
        @add-to-group="(id) => emit('add-to-group', id)"
        @remove-from-group="(id) => emit('remove-from-group', id)"
      />
      <template #footer>
        <Button
          class="btn btn-primary"
          :disabled="
            Object.keys(groupParticipants).length < 2 || !groupName?.trim()
          "
          @click="emit('create-group')"
          >Создать</Button
        >
      </template>
    </Modal>
  </div>
  <SearchDropdown
    v-if="isSidebarDropdownOpen"
    :messages="globalFoundMessages"
    :found-users="foundUsers"
    @message-click="(id) => emit('message-click', id)"
    @open-chat="(id) => emit('open-chat', id)"
    @add-friend="(id) => emit('add-friend', id)"
  />
</template>

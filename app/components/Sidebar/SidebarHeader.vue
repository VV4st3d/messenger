<script setup lang="ts">
import type { IFoundUser, IMessage } from '~/shared/types';
import Modal from '../ui/Modal.vue';

interface IEmits {
  (e: 'search-global', event: InputEvent): void;
  (e: 'open-chat' | 'add-friend' | 'message-click', id: string): void;
}
interface IProps {
  isSidebarDropdownOpen: boolean;
  globalFoundMessages: IMessage[];
  foundUsers: IFoundUser[];
}
const queryInput = defineModel<string>('queryInput');
const isModalCreateGroupOpen = defineModel<boolean>('isModalCreateGroupOpen');

const emit = defineEmits<IEmits>();
defineProps<IProps>();
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
    <button
      class="hover:text-[var(--accent)]"
      @click="isModalCreateGroupOpen = true"
    >
      <Icon size="20" is-not-default name="fluent-mdl2:add-group" />
    </button>

    <Modal v-model="isModalCreateGroupOpen">
      <template #header> Создать групповой чат </template>
      Are you sure?
      <template #footer>
        <button class="btn btn-primary">Создать</button>
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

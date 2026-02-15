<script setup lang="ts">
import type { IFoundUser, IMessage } from '~/shared/types';
import { ROUTES } from '~/shared/const';
import SearchDropdownMessageItem from './SearchDropdownMessageItem.vue';
import SearchDropdownUserItem from './SearchDropdownUserItem.vue';

interface IProps {
  messages: IMessage[];
  foundUsers?: IFoundUser[];
}
interface IEmits {
  (e: 'open-chat' | 'add-friend' | 'message-click', id: string): void;
}

defineProps<IProps>();
const emit = defineEmits<IEmits>();
</script>

<template>
  <div
    class="absolute top-full right-0 w-full bg-[var(--bg-primary)] border border-[var(--border)] shadow-lg overflow-hidden z-50 rounded-xl"
    @click.stop
  >
    <slot />
    <div v-if="messages.length > 0" class="dropdown-section">
      <div class="dropdown-title">Сообщения</div>

      <div class="max-h-[200px] overflow-y-auto">
        <NuxtLink
          v-for="message in messages"
          :key="message.id"
          :to="ROUTES.getRouteChat(message.chat.id)"
          class="block"
        >
          <SearchDropdownMessageItem
            :content="message.content"
            :img-src="message.sender.avatarUrl"
            :name="message.sender.displayName"
            @click="emit('message-click', message.id)"
          />
        </NuxtLink>
      </div>
    </div>
    <div
      v-if="foundUsers && foundUsers.length > 0"
      class="dropdown-section border-t border-[var(--border)]"
    >
      <div class="dropdown-title">Пользователи</div>

      <SearchDropdownUserItem
        :found-users="foundUsers"
        @add-friend="(id) => emit('add-friend', id)"
        @open-chat="(id) => emit('open-chat', id)"
      />
    </div>

    <div
      v-if="messages.length === 0 && (!foundUsers || foundUsers.length === 0)"
      class="px-4 py-6 text-center text-sm text-[var(--text-secondary)]"
    >
      Ничего не найдено
    </div>
  </div>
</template>

<style scoped>
.dropdown-section {
  padding: 4px 0;
}

.dropdown-title {
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  background: var(--bg-secondary);
}
</style>

<script setup lang="ts">
import type { IMessage } from '~/shared/types';
import Avatar from './Avatar/Avatar.vue';
import { ROUTES } from '~/shared/const';

interface IProps {
  foundMessages: IMessage[];
  onMessageClick: (chatId: string) => Promise<void>;
}
const props = defineProps<IProps>();
</script>

<template>
  <div
    class="absolute top-full right-0 w-full bg-[var(--bg-primary)] border border-[var(--border)] shadow-lg overflow-hidden z-50"
    @click.stop
  >
    <slot />
    <div v-if="foundMessages.length > 0" class="max-h-[320px] overflow-y-auto">
      <NuxtLink
        v-for="message in foundMessages"
        :key="message.id"
        :to="ROUTES.getRouteChat(message.chat.id)"
      >
        <div
          class="px-4 py-3 cursor-pointer hover:bg-[var(--bg-secondary)] transition flex gap-3"
          @click="onMessageClick(message.id)"
        >
          <div class="flex-shrink-0">
            <Avatar :src="message.sender?.avatarUrl" size="sm" />
          </div>

          <div class="flex flex-col gap-1 min-w-0">
            <p class="text-sm text-[var(--text-primary)] truncate">
              {{ message.sender?.displayName }}
            </p>

            <p class="text-xs text-[var(--text-secondary)] truncate">
              {{ message.content }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
    <div
      v-else
      class="px-4 py-6 text-center text-sm text-[var(--text-secondary)]"
    >
      Ничего не найдено
    </div>
  </div>
</template>

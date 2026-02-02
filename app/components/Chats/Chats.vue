<script setup lang="ts">
import { ROUTES } from '~/shared/const';
import type { IChat, ITyping } from '~/shared/types';

defineProps<{ chats: IChat[]; typing: ITyping | undefined }>();
</script>

<template>
  <div
    v-for="chat in chats"
    :key="chat.id"
    class="chat-item flex items-center gap-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
  >
    <NuxtLink
      #="{ isActive }"
      class="w-full"
      :to="ROUTES.getRouteChat(chat.id)"
    >
      <ChatsChatCard
        :typing="typing"
        :class="isActive ? 'active_link' : null"
        class="p-4"
        :chat="chat"
      />
    </NuxtLink>
  </div>
</template>

<style scoped>
.active_link {
  background: rgba(255, 255, 255, 0.04);
}
</style>

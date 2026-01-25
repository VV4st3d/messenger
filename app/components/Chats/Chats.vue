<script setup lang="ts">
import { getRouteChat } from '~/shared/const';
import type { IChat } from '~/shared/types';

defineProps<{ chats: IChat[] }>();
</script>

<template>
  <div
    v-for="chat in chats"
    :key="chat.id"
    class="chat-item flex items-center gap-4 hover:bg-[rgba(255,255,255,0.04)] transition-colors cursor-pointer"
  >
    <NuxtLink class="w-full p-4" :to="getRouteChat(chat.id)">
      <ChatsChatCard :chat="chat" />
    </NuxtLink>
  </div>
</template>

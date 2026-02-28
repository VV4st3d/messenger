<script setup lang="ts">
import type { IProfile } from '~/shared/types/profile';
import Avatar from '../ui/Avatar/Avatar.vue';
import type { TEvents } from './type';

defineProps<{ profile: IProfile; status: string }>();
const emit = defineEmits<{ (e: TEvents, id: string): void }>();
</script>

<template>
  <div class="relative overflow-hidden pb-16">
    <div class="absolute inset-0 bg-[var(--bg-secondary)]" />
    <div
      class="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/15 via-transparent to-transparent"
    />

    <div class="relative z-10 flex flex-col items-center pt-24 sm:pt-32 px-4">
      <div class="relative mb-5 group">
        <Avatar
          :src="profile.avatarUrl"
          :online="profile.isOnline"
          size="profile"
        />
      </div>

      <h1
        class="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]"
      >
        {{ profile.displayName }}
      </h1>

      <p class="mt-1 text-lg text-[var(--text-secondary)]">
        @{{ profile.username }}
      </p>

      <div class="mt-3 flex items-center gap-3 text-sm">
        <span class="font-medium text-[var(--online)]"> {{ status }} </span>
      </div>

      <ProfileActions
        :user-profile="profile"
        @accept-request="(id) => emit('accept-request', id)"
        @chat-open="(id) => emit('chat-open', id)"
        @delete-friend="(id) => emit('delete-friend', id)"
        @cancel-request="(id) => emit('cancel-request', id)"
        @send-request="(id) => emit('send-request', id)"
        @reject-request="(id) => emit('reject-request', id)"
      />
    </div>
  </div>
</template>

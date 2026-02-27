<script setup lang="ts">
import Icon from '../ui/Icon.vue';

const props = defineProps<{ isOwnProfile: boolean }>();
</script>

<template>
  <div v-if="!isOwnProfile" class="mt-7 flex flex-wrap gap-3 justify-center">
    <button
      class="flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius)] font-medium text-white bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] shadow-[0_10px_25px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(99,102,241,0.45)]"
    >
      <Icon name="user-plus" size="20" />
      Добавить в друзья
    </button>

    <button
      class="flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius)] font-medium bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)]"
    >
      <Icon name="chat-bubble-left-right-20" size="20" />
      Написать
    </button>
  </div>
  <div v-else class="mt-7 flex flex-wrap gap-3 justify-center">
    <button
      class="flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius)] font-medium text-white bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] shadow-[0_10px_25px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(99,102,241,0.45)]"
    >
      <Icon is-not-default name="boxicons:edit-filled" size="20" />
      Редактировать профиль
    </button>
  </div>
</template>

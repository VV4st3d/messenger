<script setup lang="ts">
import Avatar from '../ui/Avatar/Avatar.vue';

interface IProps {
  imgSrc?: string;
  name?: string;
  content?: string;
}
defineProps<IProps>();
</script>

<template>
  <div
    class="px-4 py-3 cursor-pointer hover:bg-[var(--bg-secondary)] transition flex gap-3"
  >
    <div class="flex-shrink-0">
      <Avatar :src="imgSrc" size="sm" />
    </div>

    <div class="flex flex-col gap-1 min-w-0">
      <p class="text-sm text-[var(--text-primary)] truncate">
        {{ name }}
      </p>

      <p v-if="content" class="text-xs text-[var(--text-secondary)] truncate">
        {{ content }}
      </p>
    </div>
  </div>
</template>

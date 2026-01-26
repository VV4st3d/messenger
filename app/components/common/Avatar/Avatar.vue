<script setup lang="ts">
import { ref } from 'vue';
import { AVATAR_SIZE_CLASSES, STATUS_SIZE_CLASSES } from './consts';

interface Props {
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  online?: boolean | null;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  src: '',
  online: false,
});

const hasError = ref(false);
</script>

<template>
  <div
    class="relative inline-flex flex-shrink-0"
    :class="AVATAR_SIZE_CLASSES[size]"
  >
    <div
      class="w-full h-full flex items-center justify-center overflow-hidden bg-[var(--bg-tertiary)] rounded-full"
    >
      <img
        v-if="src && !hasError"
        :src="src"
        alt="Avatar"
        class="w-full h-full object-cover"
        @error="hasError = true"
      >

      <UiIcon v-else name="user" class="defaultAvatar" />
    </div>

    <div
      v-if="online"
      style="bottom: 0; right: 0"
      class="absolute rounded-full bg-[var(--online)] border-2 border-[var(--bg-secondary)]"
      :class="STATUS_SIZE_CLASSES[size]"
    />
  </div>
</template>

<style scoped>
.defaultAvatar {
  width: 100%;
  height: 100%;
  color: var(--text-secondary);
  stroke: var(--border);
}
</style>

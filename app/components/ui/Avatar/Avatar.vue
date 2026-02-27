<script setup lang="ts">
import { ref } from 'vue';
import { AVATAR_SIZE_CLASSES, STATUS_SIZE_CLASSES } from './consts';
import Icon from '~/components/ui/Icon.vue';

interface IProps {
  src?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'profile';
  online?: boolean | null;
}

withDefaults(defineProps<IProps>(), {
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

      <Icon v-else name="user" class="defaultAvatar" />
    </div>

    <div
      v-if="online"
      class="absolute rounded-full bg-[var(--online)] border-[var(--bg-secondary)]"
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

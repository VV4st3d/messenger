<script setup lang="ts">
import type { IMessage } from '~/shared/types';
import Icon from '../ui/Icon.vue';

defineProps<{ msg: IMessage }>();
const emit = defineEmits<{
  (e: 'click-pinned' | 'unpin-message', id: string): void;
}>();
</script>

<template>
  <div
    class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] :bg-[var(hover--bg-hover)] transition-colors duration-200 min-w-[200px] max-w-[340px]"
  >
    <div class="flex-1 min-w-0">
      <div class="text-[11px] text-[var(--text-tertiary)] truncate">
        {{ msg.sender.displayName || msg.sender.username }}
      </div>

      <div class="text-xs text-[var(--text-primary)] truncate">
        {{ msg.content }}
      </div>
    </div>

    <div class="flex items-center gap-1">
      <button
        class="text-[11px] text-[var(--accent)] opacity-70 hover:opacity-100 transition pointer"
        @click="emit('click-pinned', msg.id)"
      >
        Перейти
      </button>

      <button
        class="p-1 rounded-md opacity-40 hover:opacity-100 hover:text-[var(--danger)] transition"
        @click="emit('unpin-message', msg.id)"
      >
        <Icon name="x-mark" size="14" />
      </button>
    </div>
  </div>
</template>

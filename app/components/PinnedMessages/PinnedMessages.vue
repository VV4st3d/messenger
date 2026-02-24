<script setup lang="ts">
import type { IMessage } from '~/shared/types';
import Icon from '../ui/Icon.vue';
import PinnedMessageCard from './PinnedMessageCard.vue';

defineProps<{ pinnedMessages: IMessage[] }>();
const emit = defineEmits<{
  (e: 'click-pinned' | 'unpin-message', id: string): void;
}>();
</script>
<template>
  <div
    v-if="pinnedMessages.length > 0"
    class="border-b border-[var(--border)] bg-[var(--bg-secondary)]"
  >
    <div
      class="flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)]"
    >
      <Icon
        is-not-default
        name="mynaui:pin-solid"
        class="w-4 h-4 text-[var(--accent)]"
      />
      <span class="font-medium">Закреплённые</span>
      <span class="opacity-50">{{ pinnedMessages.length }}</span>
    </div>

    <div class="flex gap-2 p-2 overflow-x-auto">
      <PinnedMessageCard
        v-for="message in pinnedMessages"
        :key="message.id"
        :msg="message"
        @click-pinned="(id) => emit('click-pinned', id)"
        @unpin-message="(id) => emit('unpin-message', id)"
      />
    </div>
  </div>
</template>

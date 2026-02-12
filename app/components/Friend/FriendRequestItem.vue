<script setup lang="ts">
import type { IFriendIncoming, IFriendOutgoing } from '~/shared/types';
import Avatar from '../ui/Avatar/Avatar.vue';
import Icon from '../ui/Icon.vue';
import { computed } from 'vue';

interface IProps {
  request: IFriendOutgoing | IFriendIncoming;
  subtitle: string;
  type: 'incoming' | 'outgoing';
}

interface IEmits {
  (e: 'accept' | 'reject' | 'cancel', id: string): void;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmits>();

const user = computed(() =>
  'fromUser' in props.request ? props.request.fromUser : props.request.toUser,
);

const cancel = (id: string) => {
  const event = props.type === 'incoming' ? 'reject' : 'cancel';
  emit(event, id);
};
</script>

<template>
  <div
    class="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary-hover)] transition-colors"
  >
    <div class="relative">
      <Avatar :src="user.avatarUrl" size="md" />
    </div>
    <div class="flex-1 min-w-0">
      <div class="font-medium truncate">
        {{ user.displayName || user.username }}
      </div>
      <div class="text-xs text-[var(--text-tertiary)]">
        {{ subtitle }}
      </div>
    </div>
    <div class="flex gap-2">
      <button
        v-if="type === 'incoming'"
        class="p-2 rounded-full hover:bg-[var(--accent)]/10 text-[var(--accent)]"
        @click="emit('accept', request.id)"
      >
        <Icon name="check" size="20" />
      </button>
      <button
        class="p-2 rounded-full hover:bg-[var(--danger)]/10 text-[var(--danger)]"
        @click="cancel(request.id)"
      >
        <Icon name="x-mark" size="20" />
      </button>
    </div>
  </div>
</template>

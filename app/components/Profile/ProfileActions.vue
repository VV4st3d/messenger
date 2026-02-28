<script setup lang="ts">
import type { IProfile } from '~/shared/types/profile';
import Icon from '../ui/Icon.vue';
import { actionButtonsMap } from './const';
import type { TEvents } from './type';
import { computed } from 'vue';

interface IEmits {
  (e: TEvents, id: string): void;
}

const props = defineProps<{
  userProfile: IProfile;
}>();
const emit = defineEmits<IEmits>();

const actions = computed(
  () => actionButtonsMap[props.userProfile.friendRequestStatus],
);

const eventPayload = computed(() => {
  if (
    (props.userProfile.friendRequestStatus === 'received' ||
      props.userProfile.friendRequestStatus === 'sent') &&
    props.userProfile.friendRequestId
  ) {
    return props.userProfile.friendRequestId;
  }
  return props.userProfile.id;
});
</script>

<template>
  <div
    v-if="!userProfile.isOwnProfile"
    class="mt-7 flex flex-wrap gap-3 justify-center"
  >
    <button
      v-for="btn in actions"
      :key="btn.eventName"
      :class="[
        btn.isDanger
          ? 'bg-[var(--danger)]'
          : 'bg-[var(--accent)] bg-gradient-to-br',
        'flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius)] font-medium text-white transition-all duration-200 hover:-translate-y-0.5',
      ]"
      @click="emit(btn.eventName, eventPayload)"
    >
      <Icon :name="btn.icon" size="20" />
      {{ btn.buttonLabel }}
    </button>

    <button
      class="flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius)] font-medium bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent)] hover:bg-[var(--bg-secondary)]"
      @click="emit('chat-open', userProfile.id)"
    >
      <Icon name="chat-bubble-left-right-20" size="20" />
      Написать
    </button>
  </div>
  <div v-else class="mt-7 flex flex-wrap gap-3 justify-center">
    <button
      class="flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius)] font-medium text-white bg-gradient-to-br bg-[var(--accent)] transition-all duration-200 hover:-translate-y-0.5"
    >
      <Icon is-not-default name="boxicons:edit-filled" size="20" />
      Редактировать профиль
    </button>
  </div>
</template>

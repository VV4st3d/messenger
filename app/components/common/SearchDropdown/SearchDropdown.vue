<script setup lang="ts">
import { ref, useDebounce } from '#imports';
import type { IMessage } from '~/shared/types';
import Avatar from '../Avatar/Avatar.vue';
import Icon from '~/components/ui/Icon.vue';

interface IProps {
  handleFindMessage: (
    chatId: string,
    query: { query: string },
  ) => Promise<void>;
  foundMessages: IMessage[];
  chatId: string;
}
const props = defineProps<IProps>();

const queryInput = ref<string>('');
const handleFindMessagesDebounced = useDebounce(props.handleFindMessage, 700);

const onSearch = () => {
  handleFindMessagesDebounced(props.chatId, {
    query: queryInput.value,
  });
};
</script>

<template>
  <div
    class="absolute top-full right-0 mt-2 w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-50"
  >
    <div class="p-3 border-b border-[var(--border)]">
      <div
        class="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2"
      >
        <Icon
          name="magnifying-glass"
          size="16"
          class="text-[var(--text-secondary)]"
        />
        <input
          v-model="queryInput"
          type="text"
          placeholder="Поиск..."
          class="w-full bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
          @input="onSearch"
        >
      </div>
    </div>

    <div v-if="foundMessages.length > 0" class="max-h-[320px] overflow-y-auto">
      <div
        v-for="message in foundMessages"
        :key="message.id"
        class="px-4 py-3 cursor-pointer hover:bg-[var(--bg-secondary)] transition flex gap-3"
      >
        <div class="flex-shrink-0">
          <Avatar :src="message.sender?.avatarUrl" size="sm" />
        </div>

        <div class="flex flex-col gap-1 min-w-0">
          <p class="text-sm text-[var(--text-primary)] truncate">
            {{ message.sender.displayName }}
          </p>

          <p class="text-xs text-[var(--text-secondary)] truncate">
            {{ message.content }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-else
      class="px-4 py-6 text-center text-sm text-[var(--text-secondary)]"
    >
      Ничего не найдено
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, formatLastMessageDate, useAuth } from '#imports';
import type { IMessage } from '~/shared/types';
import Icon from '../ui/Icon.vue';
const props = defineProps<{ message: IMessage }>();
const { user } = useAuth();

const formattedTime = computed(() =>
  formatLastMessageDate(props.message.createdAt),
);
</script>

<template>
  <div class="flex flex-col">
    <div
      v-if="message.sender.id !== user?.id"
      class="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]"
    >
      <div class="flex flex-col">
        <div
          class="message-other relative p-3 rounded-2xl rounded-bl-none shadow-sm bg-[var(--message-other)] border border-[var(--border-color)]"
        >
          <p
            class="text-[var(--text-primary)] leading-relaxed break-words whitespace-pre-wrap overflow-hidden"
          >
            {{ message.content }}
          </p>

          <div class="flex justify-end mt-1">
            <span
              class="text-[10px] uppercase font-medium text-[var(--text-tertiary)]"
            >
              {{ formattedTime }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex items-end justify-end gap-2 max-w-[85%] sm:max-w-[70%] ml-auto"
    >
      <div class="flex flex-col items-end">
        <div
          class="message-own relative p-3 rounded-2xl rounded-br-none shadow-md bg-[var(--message-own)] text-white"
        >
          <p
            class="leading-relaxed break-words whitespace-pre-wrap overflow-hidden"
          >
            {{ message.content }}
          </p>

          <div class="flex justify-end items-center gap-1 mt-1">
            <span class="text-[10px] uppercase font-medium opacity-70">
              {{ formattedTime }}
            </span>
            <Icon
              v-if="message.isRead"
              is-not-default
              :name="'solar:check-read-linear'"
            />
            <Icon v-else is-not-default :name="'lineicons:check'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.break-words {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}

.message-other,
.message-own {
  transition: transform 0.1s ease;
  will-change: transform;
}
</style>

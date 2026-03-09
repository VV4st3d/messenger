<script setup lang="ts">
interface IProps {
  isOwn: boolean;
  time: string;
  isRead: boolean;
}
defineProps<IProps>();
</script>

<template>
  <div
    class="message-meta flex items-center gap-1.5 px-3.5 pb-2 text-xs"
    :class="
      isOwn
        ? 'justify-end text-gray-500 dark:text-gray-300'
        : 'text-gray-500 dark:text-gray-400'
    "
  >
    <span class="time min-w-[38px] text-right opacity-90 font-medium">
      {{ time }}
    </span>

    <template v-if="isOwn">
      <Icon
        v-if="isRead"
        is-not-default
        name="solar:check-read-linear"
        class="status text-blue-600 dark:text-blue-400 w-4 h-4 opacity-100"
      />
      <Icon
        v-else
        is-not-default
        name="lineicons:check"
        class="status w-4 h-4 opacity-75"
      />
    </template>
  </div>
</template>

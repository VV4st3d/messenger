<script setup lang="ts">
import { computed } from 'vue';
import { formatLastMessageDate } from '#imports';
import type { IMessage } from '~/shared/types';
import Icon from '../ui/Icon.vue';
import type { IGeneratedSummary } from './type';

interface IProps {
  message: IMessage;
  isAnchor?: boolean;
  userId: string | undefined;
  generatedSummary?: IGeneratedSummary;
}

const props = defineProps<IProps>();

const formattedTime = computed(() =>
  formatLastMessageDate(props.message.createdAt),
);

const isOwn = computed(() => props.message.sender?.id === props.userId);

const emit = defineEmits<{
  (e: 'context', payload: { event: MouseEvent; message: IMessage }): void;
}>();

const onRightClick = (event: MouseEvent) => {
  emit('context', { event, message: props.message });
};

const isGenerating = computed(
  () =>
    props.generatedSummary?.isGenerating &&
    props.generatedSummary.id === props.message.id,
);
</script>

<template>
  <div
    class="flex flex-col message-card"
    :class="{ 'highlight-active': isAnchor }"
  >
    <div
      v-if="!isOwn"
      class="flex items-end gap-2 max-w-[86%] sm:max-w-[74%] pr-2"
      @contextmenu.prevent="onRightClick"
    >
      <div
        class="message-other flex flex-col rounded-2xl bg-gray-100 dark:bg-gray-800 transition-all duration-200 min-h-[44px]"
        :class="{
          'has-image rounded-xl bg-transparent': message.filePath,
          'generating-summary': isGenerating,
        }"
      >
        <div
          v-if="message.filePath"
          class="message-image h-[380px] overflow-hidden rounded-[0.75rem_0.75rem_0.4rem_0.4rem] w-full max-w-[320px] aspect-[4/5] sm:aspect-[5/6] bg-gray-200 dark:bg-gray-700"
        >
          <img
            :src="`http://localhost:8080/uploads${message.filePath}`"
            alt="attachment"
            class="w-full h-full object-cover block"
          >
        </div>

        <p
          v-if="message.content"
          class="message-text px-3.5 py-2.5 text-[15px] leading-5 whitespace-pre-wrap break-words"
          :class="{ 'pt-2': message.filePath }"
        >
          {{ message.content }}
        </p>

        <div
          class="message-meta flex items-center gap-1.5 px-3.5 pb-2 text-xs text-gray-500 dark:text-gray-400"
        >
          <span class="time min-w-[38px] text-right opacity-90 font-medium">{{
            formattedTime
          }}</span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex items-end justify-end max-w-[86%] sm:max-w-[74%] ml-auto pl-2"
      @contextmenu.prevent="onRightClick"
    >
      <div
        class="message-own flex flex-col rounded-2xl bg-blue-100 dark:bg-blue-900/40 transition-all duration-200 min-h-[44px]"
        :class="{
          'has-image rounded-xl bg-transparent': message.filePath,
          'generating-summary': isGenerating,
        }"
      >
        <div
          v-if="message.filePath"
          class="message-image h-[380px] overflow-hidden rounded-[0.75rem_0.75rem_0.4rem_0.4rem] w-full max-w-[320px] aspect-[4/5] sm:aspect-[5/6] bg-gray-200 dark:bg-gray-700"
        >
          <img
            :src="`http://localhost:8080/uploads${message.filePath}`"
            alt="attachment"
            class="w-full h-full object-cover block"
          >
        </div>

        <p
          v-if="message.content"
          class="message-text px-3.5 py-2.5 text-[15px] leading-5 whitespace-pre-wrap break-words"
          :class="{ 'pt-2': message.filePath }"
        >
          {{ message.content }}
        </p>

        <div
          class="message-meta flex items-center justify-end gap-1.5 px-3.5 pb-2 text-xs text-gray-500 dark:text-gray-300"
        >
          <span class="time min-w-[38px] text-right opacity-90 font-medium">{{
            formattedTime
          }}</span>
          <Icon
            v-if="message.isRead"
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.generating-summary {
  background: linear-gradient(
    270deg,
    var(--accent),
    var(--accent-hover),
    #8b5cf6,
    var(--accent)
  ) !important;
  background-size: 300% 300%;
  animation: accentGradient 6s ease infinite;
}

.highlight-active .message-own,
.highlight-active .message-other {
  animation: highlightSubtle 2s ease-in-out forwards;
  z-index: 1;
}

@keyframes highlightSubtle {
  0% {
    filter: brightness(1);
    box-shadow: 0 0 0 rgba(99, 102, 241, 0);
  }
  30% {
    filter: brightness(1.15);
    box-shadow: 0 0 14px rgba(99, 102, 241, 0.35);
  }
  100% {
    filter: brightness(1);
    box-shadow: 0 0 0 rgba(99, 102, 241, 0);
  }
}

@keyframes accentGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

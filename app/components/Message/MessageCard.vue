<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatLastMessageDate } from '#imports';
import type { IMessage } from '~/shared/types';
import Icon from '../ui/Icon.vue';
import type { IGeneratedSummary } from './type';
import type { Lottie } from 'nuxt-lottie';

interface IProps {
  message: IMessage;
  isAnchor?: boolean;
  userId: string | undefined;
  generatedSummary?: IGeneratedSummary;
}
const LOTTIE = 'lottieElement';
const lottieElement = ref<Lottie | null>(null);
const playingAnimationMap = ref<Record<string, boolean>>({});

const props = defineProps<IProps>();

const formattedTime = computed(() =>
  formatLastMessageDate(props.message.createdAt),
);

const isOwn = computed(() => props.message.sender?.id === props.userId);

const isGenerating = computed(
  () =>
    props.generatedSummary?.isGenerating &&
    props.generatedSummary.id === props.message.id,
);

const emit = defineEmits<{
  (e: 'context', payload: { event: MouseEvent; message: IMessage }): void;
}>();

const onRightClick = (event: MouseEvent) => {
  emit('context', { event, message: props.message });
};

const additionalClasses = computed(() => {
  let result = '';
  if (props.message.filePath) {
    result += 'has-image rounded-xl bg-transparent';
  }
  if (isGenerating.value) {
    result += 'generating-summary';
  }
  if (props.message.type === 'sticker') {
    result += 'isSticker';
  }
  return result;
});

const playStickerAnimation = (messageId: string) => {
  if (lottieElement.value && !playingAnimationMap.value[messageId]) {
    lottieElement.value.goToAndPlay(0);
    playingAnimationMap.value[messageId] = true;
  }
};
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
      <div v-if="message.type === 'sticker'">
        <Lottie :ref="LOTTIE" :loop="1" :height="200" :name="message.content" />
      </div>
      <div
        class="message-other flex flex-col rounded-2xl bg-gray-100 transition-all duration-200 min-h-[44px]"
        :class="additionalClasses"
      >
        <div
          v-if="message.filePath"
          class="message-image h-[380px] overflow-hidden rounded-[0.75rem_0.75rem_0.4rem_0.4rem] w-full max-w-[320px] aspect-[4/5] sm:aspect-[5/6] bg-gray-200 dark:bg-gray-700"
        >
          <img
            loading="lazy"
            :src="`http://localhost:8080/uploads${message.filePath}`"
            alt="attachment"
            class="w-full h-full object-cover block"
          >
        </div>

        <p
          v-if="message.content && message.type !== 'sticker'"
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
        class="message-own flex flex-col rounded-2xl bg-blue-100 transition-all duration-200 min-h-[44px]"
        :class="additionalClasses"
      >
        <div v-if="message.type === 'sticker'">
          <Lottie
            :ref="LOTTIE"
            :height="200"
            :name="message.content"
            :loop="1"
            @click="playStickerAnimation(message.id)"
            @on-complete="playingAnimationMap[message.id] = false"
          />
        </div>
        <div
          v-if="message.filePath"
          class="message-image h-[380px] overflow-hidden rounded-[0.75rem_0.75rem_0.4rem_0.4rem] w-full max-w-[320px] aspect-[4/5] sm:aspect-[5/6] bg-gray-200 dark:bg-gray-700"
        >
          <img
            loading="lazy"
            :src="`http://localhost:8080/uploads${message.filePath}`"
            alt="attachment"
            class="w-full h-full object-cover block"
          >
        </div>

        <p
          v-if="message.content && message.type !== 'sticker'"
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
  background-image: linear-gradient(
    270deg,
    var(--accent),
    var(--accent-hover),
    #8b5cf6,
    var(--accent)
  ) !important;

  background-size: 400% 400% !important;
  animation: accentGradient 3s ease infinite !important;
  background-color: transparent !important;
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

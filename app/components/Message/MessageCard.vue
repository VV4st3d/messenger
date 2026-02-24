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
const isAnimatingSticker = ref(false);

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

const wrapperClasses = computed(() => ({
  'flex items-end gap-2 max-w-[86%] sm:max-w-[74%]': true,
  'ml-auto pl-2 justify-end': isOwn.value,
  'pr-2': !isOwn.value,
}));

const bubbleClasses = computed(() => ({
  'flex flex-col rounded-2xl transition-all duration-200 min-h-[44px]': true,
  'bg-blue-100 message-own': isOwn.value,
  'bg-gray-100 message-other': !isOwn.value,
  'has-image rounded-xl bg-transparent': !!props.message.filePath,
  'generating-summary': isGenerating.value,
  isSticker: props.message.type === 'sticker',
}));

const playStickerAnimation = () => {
  if (lottieElement.value && !isAnimatingSticker.value) {
    lottieElement.value.goToAndPlay(0);
    isAnimatingSticker.value = true;
  }
};
</script>

<template>
  <div
    class="flex flex-col message-card"
    :class="{ 'highlight-active': isAnchor }"
  >
    <div :class="wrapperClasses" @contextmenu.prevent="onRightClick">
      <div :class="bubbleClasses">
        <div v-if="message.type === 'sticker'" class="h-[200px]">
          <LazyLottie
            :ref="LOTTIE"
            :height="200"
            :link="`/stickers/${message.content}.json`"
            :loop="1"
            @click="playStickerAnimation"
            @on-complete="isAnimatingSticker = false"
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
          class="message-meta flex items-center gap-1.5 px-3.5 pb-2 text-xs"
          :class="
            isOwn
              ? 'justify-end text-gray-500 dark:text-gray-300'
              : 'text-gray-500 dark:text-gray-400'
          "
        >
          <span class="time min-w-[38px] text-right opacity-90 font-medium">
            {{ formattedTime }}
          </span>

          <template v-if="isOwn">
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
          </template>
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

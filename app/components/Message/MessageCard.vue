<script setup lang="ts">
import { computed } from 'vue';
import { formatLastMessageDate } from '#imports';
import type { IMessage } from '~/shared/types';
import type { IGeneratedSummary } from './type';
import type { emojiMap } from '~/shared/const/emoji';
import { mapStickerToLottieName } from '~/shared/const/emoji';
import Sticker from './MessageCard/Message/Sticker.vue';
import File from './MessageCard/Message/File.vue';
import MessageMeta from './MessageCard/Message/MessageMeta.vue';
import Avatar from '../ui/Avatar/Avatar.vue';

interface IProps {
  message: IMessage;
  isAnchor?: boolean;
  userId: string | undefined;
  generatedSummary?: IGeneratedSummary;
  showAvatar?: boolean;
}

const props = defineProps<IProps>();
const emit = defineEmits<{
  (e: 'context', payload: { event: MouseEvent; message: IMessage }): void;
}>();

const formattedTime = computed(() =>
  formatLastMessageDate(props.message.createdAt),
);

const isOwn = computed(() => props.message.sender?.id === props.userId);

const isGenerating = computed(
  () =>
    props.generatedSummary?.isGenerating &&
    props.generatedSummary.id === props.message.id,
);

const onRightClick = (event: MouseEvent) => {
  emit('context', { event, message: props.message });
};

const wrapperClasses = computed(() => ({
  'flex items-end gap-2 max-w-[86%] sm:max-w-[74%]': true,
  'ml-auto pl-2 justify-end': isOwn.value,
  'pr-2': !isOwn.value,
}));

const sticker = computed(() =>
  mapStickerToLottieName(props.message.content as keyof typeof emojiMap),
);

const isSoloImage = computed(
  () => !props.message.content.length && props.message.type === 'image',
);

const bubbleClasses = computed(() => ({
  'flex flex-col rounded-2xl transition-all duration-200 min-h-[44px]': true,
  'bg-blue-100 message-own': isOwn.value,
  'bg-gray-100 message-other': !isOwn.value,
  'has-image rounded-xl bg-transparent': !!props.message.filePath,
  'generating-summary': isGenerating.value,
  isSticker: props.message.type === 'sticker',
  relative: isSoloImage,
}));
</script>

<template>
  <div
    class="flex flex-col message-card"
    :class="{
      'highlight-active': isAnchor,
    }"
  >
    <div :class="wrapperClasses" @contextmenu.prevent="onRightClick">
      <Avatar
        v-if="!isOwn && showAvatar"
        size="sm"
        :src="message.sender.avatarUrl"
      />
      <div :class="bubbleClasses">
        <div v-if="message.type === 'sticker' && sticker" class="h-[200px]">
          <Sticker :sticker-name="sticker" />
        </div>

        <div
          v-if="message.filePath"
          class="message-image overflow-hidden rounded-[0.75rem_0.75rem_0.4rem_0.4rem]"
          :class="{
            'h-[380px]': message.type === 'image',
          }"
        >
          <File :file="message" />
        </div>

        <div
          v-if="message.content && message.type !== 'sticker'"
          class="message px-3.5 py-2.5 text-[15px] leading-5 whitespace-pre-wrap break-words"
        >
          {{ message.content }}
        </div>

        <MessageMeta
          :is-own="isOwn"
          :time="formattedTime"
          :is-read="message.isRead"
          :class="{ 'absolute bottom-0 right-0': isSoloImage }"
        />
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

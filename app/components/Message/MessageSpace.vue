<script setup lang="ts">
import { useIntersectionObserver } from '#imports';
import { nextTick, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import type { IChat, IGetMessageQuery, IMessage } from '~/shared/types';
import { MIN_MESSAGE_SIZE, REFS } from './const';
import type MessageCard from './MessageCard.vue';

const props = defineProps<{
  messages: IMessage[];
  chat: IChat | undefined;
  lastMessageDate: string | undefined;
  hasMore: boolean | undefined;
  resetMessages: () => void;
  getMesseges: (chatId: string, query?: IGetMessageQuery) => Promise<void>;
}>();

const scroller = useTemplateRef(REFS.REF_SCROLLER);
const targetMessage = useTemplateRef<InstanceType<typeof MessageCard>>(
  REFS.REF_TARGET_MESSAGE,
);

const isInitialScroll = ref(true);
const isPrepending = ref(false);
const prevScrollHeight = ref(0);
const prevScrollTop = ref(0);

const scrollToBottom = async (smooth: boolean) => {
  await nextTick();
  if (!scroller.value) return;
  const el = scroller.value.$el || scroller.value;

  el.style.scrollBehavior = smooth ? 'smooth' : 'auto';
  scroller.value.scrollToBottom();
};

const saveScrollPosition = () => {
  const el = scroller.value.$el;
  prevScrollHeight.value = el.scrollHeight;
  prevScrollTop.value = el.scrollTop;
};

const { pause, resume } = useIntersectionObserver(
  targetMessage,
  async ([entry]) => {
    if (
      !entry?.isIntersecting ||
      !scroller.value.$el ||
      !targetMessage ||
      !props.hasMore
    )
      return;
    await onIntersection();
  },
);

const onIntersection = async (): Promise<void> => {
  pause();

  isPrepending.value = true;
  saveScrollPosition();

  if (props.chat?.id)
    await props.getMesseges(props.chat.id, {
      lastCreatedAt: props.lastMessageDate,
    });

  await nextTick();

  const el = scroller.value.$el;

  const heightDiff = el.scrollHeight - prevScrollHeight.value;

  el.scrollTop = prevScrollTop.value + heightDiff;

  isPrepending.value = false;
  resume();
};

onUnmounted(() => {
  props.resetMessages();
});

watch(
  () => props.messages.length,
  (value) => {
    if (value === 0 || isPrepending.value) return;
    scrollToBottom(!isInitialScroll.value);
    isInitialScroll.value = false;
  },
);
</script>

<template>
  <div class="flex-1 p-6 bg-[var(--bg-primary)] relative overflow-hidden">
    <div v-if="messages.length > 0" class="h-full">
      <DynamicScroller
        :ref="REFS.REF_SCROLLER"
        :items="messages"
        :min-item-size="MIN_MESSAGE_SIZE"
        class="scroller"
        key-field="id"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :size-dependencies="[item.content]"
            :item="item"
            :active="active"
            :data-index="index"
          >
            <div class="pb-6">
              <MessageCard
                :ref="
                  item.createdAt === lastMessageDate
                    ? REFS.REF_TARGET_MESSAGE
                    : undefined
                "
                :message="item"
              />
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
    <MessageEmptySpace v-else />
  </div>
</template>

<style scoped>
.scroller {
  height: 100%;
}

.scroller::-webkit-scrollbar {
  width: 6px;
}
.scroller::-webkit-scrollbar-thumb {
  background-color: var(--bg-tertiary);
  border-radius: 10px;
}
</style>

<script setup lang="ts">
import {
  storeToRefs,
  useCurrentChatStore,
  useIntersectionObserver,
} from '#imports';
import {
  nextTick,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue';
import type { IMessage } from '~/shared/types';
import { REFS } from './const';

const props = defineProps<{
  messages: IMessage[];
}>();

const scroller = useTemplateRef(REFS.REF_SCROLLER);
const targetMessage = useTemplateRef(REFS.REF_TARGET_MESSAGE);

const isInitialScroll = ref(true);
const isPrepending = ref(false);
const prevScrollHeight = ref(0);
const prevScrollTop = ref(0);

const currentChatStore = useCurrentChatStore();

const { chat, lastMessageDate } = storeToRefs(currentChatStore);

const scrollToBottom = async (smooth = true) => {
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
    if (!entry?.isIntersecting) return;

    pause();

    isPrepending.value = true;
    saveScrollPosition();

    if (chat.value?.id)
      await currentChatStore.getMessagesHandler(chat.value.id, {
        lastCreatedAt: lastMessageDate.value,
      });

    await nextTick();

    const el = scroller.value.$el;
    const heightDiff = el.scrollHeight - prevScrollHeight.value;

    el.scrollTop = prevScrollTop.value + heightDiff;

    isPrepending.value = false;
    resume();
  },
);

onUnmounted(() => {
  currentChatStore.messages = [];
});

watch(
  () => props.messages.length,
  (value) => {
    if (value === 0 || isPrepending.value) return;
    if (isInitialScroll.value) {
      scrollToBottom(false);
      isInitialScroll.value = false;
      return;
    }
    scrollToBottom();
  },
);
</script>

<template>
  <div class="flex-1 p-6 bg-[var(--bg-primary)] relative overflow-hidden">
    <div v-if="messages.length > 0" class="h-full">
      <DynamicScroller
        :ref="REFS.REF_SCROLLER"
        :items="messages"
        :min-item-size="24"
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
                  item.createdAt === currentChatStore.lastMessageDate
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

    <div
      v-else
      class="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
    >
      <div
        class="w-24 h-24 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6"
      >
        <UiIcon
          name="chat-bubble-left-right"
          class="w-12 h-12 text-[var(--text-tertiary)]"
        />
      </div>
      <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-3">
        Пока сообщений нет
      </h3>
      <p class="text-[var(--text-secondary)] max-w-md mb-8">
        Начните разговор!
      </p>
    </div>
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

<script setup lang="ts">
import { useIntersectionObserver } from '#imports';
import {
  computed,
  nextTick,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue';
import type {
  IChat,
  IContextMenu,
  IGetMessageQuery,
  IMessage,
} from '~/shared/types';
import { DIRECTION, MIN_MESSAGE_SIZE } from './const';
import type MessageCard from './MessageCard.vue';
import ContextMenu from '../ui/ContextMenu.vue';
import EmptyChat from './EmptyChat.vue';
import type { DynamicScroller } from 'vue-virtual-scroller';
import type { IGeneratedSummary } from './type';
import PinnedMessages from '../PinnedMessages/PinnedMessages.vue';

interface IProps {
  messages: IMessage[];
  pinnedMessages: IMessage[];
  contextMenu: IContextMenu;
  contextEvents: { label: string; callback: () => void }[];
  chat: IChat | null;
  userId: string | undefined;
  firstMessageDateInList: string;
  lastMessageDateInList: string;
  hasMoreTop: boolean;
  hasMoreBottom: boolean;
  isFoundBySearch: boolean;
  generatedSummary?: IGeneratedSummary;
  anchorMessageId: string;
  onFetchMessages: (chatId: string, query?: IGetMessageQuery) => Promise<void>;
}

interface IEmits {
  (e: 'unmount' | 'copy-message'): void;
  (e: 'click-pinned' | 'unpin-message', id: string): void;
  (
    e: 'open-context-menu',
    payload: { event: MouseEvent; message: IMessage },
  ): void;
}

interface IRefPayload {
  createdAt: string;
  el: InstanceType<typeof MessageCard>;
  id: string;
}

interface IObserverPayload {
  target: Ref<InstanceType<typeof MessageCard> | null>;
  direction: DIRECTION;
  hasMore: () => boolean;
  getAnchorDate: () => string | undefined;
}

const REF_SCROLLER = 'scroller';
const MESSAGE_KEY: keyof IMessage = 'id';

const props = defineProps<IProps>();

const emit = defineEmits<IEmits>();

const scroller =
  useTemplateRef<InstanceType<typeof DynamicScroller>>(REF_SCROLLER);
const targetMessageTop = ref<InstanceType<typeof MessageCard> | null>(null);
const targetMessageBottom = ref<InstanceType<typeof MessageCard> | null>(null);

const isInitialScroll = ref(true);
const isPrepending = ref(false);
const prevScrollHeight = ref(0);
const prevScrollTop = ref(0);

const hasScrolledToAnchor = ref(false);

const anchorIndex = computed(() => {
  if (!props.anchorMessageId) return -1;
  return props.messages.findIndex((m) => m.id === props.anchorMessageId);
});

const initRefs = async (payload: IRefPayload) => {
  if (payload.createdAt === props.firstMessageDateInList) {
    targetMessageTop.value = payload.el;
  } else if (targetMessageTop.value === payload.el) {
    targetMessageTop.value = null;
  }

  if (payload.createdAt === props.lastMessageDateInList) {
    targetMessageBottom.value = payload.el;
  } else if (targetMessageBottom.value === payload.el) {
    targetMessageBottom.value = null;
  }

  if (payload.id === props.anchorMessageId && !hasScrolledToAnchor.value) {
    if (!payload.el?.$el || !scroller.value) return;
    await nextTick();
    await nextTick();
    scroller.value.scrollToItem(anchorIndex.value);
    hasScrolledToAnchor.value = true;
  }
};

const scrollToBottom = async (smooth: boolean) => {
  await nextTick();
  if (!scroller.value) return;
  const el = scroller.value.$el || (scroller.value as HTMLElement);

  el.style.scrollBehavior = smooth ? 'smooth' : 'auto';
  scroller.value.scrollToBottom();
};

const saveScrollPosition = () => {
  const el = scroller.value?.$el as HTMLElement;
  if (!el) return;
  prevScrollHeight.value = el.scrollHeight;
  prevScrollTop.value = el.scrollTop;
};

const createIntersectionObserver = (payload: IObserverPayload) => {
  const observer = useIntersectionObserver(
    [payload.target] as MaybeRefOrGetter,
    async ([entry]) => {
      if (
        !entry?.isIntersecting ||
        !scroller.value?.$el ||
        !payload.target.value ||
        !payload.hasMore()
      )
        return;
      const anchorDate = payload.getAnchorDate();
      if (!anchorDate) return;

      await onIntersect(
        observer.pause,
        observer.resume,
        payload.direction,
        anchorDate,
      );
    },
  );
  return observer;
};

createIntersectionObserver({
  target: targetMessageTop,
  direction: DIRECTION.BEFORE,
  hasMore: () => props.hasMoreTop,
  getAnchorDate: () => props.firstMessageDateInList,
});

createIntersectionObserver({
  target: targetMessageBottom,
  direction: DIRECTION.AFTER,
  hasMore: () => props.hasMoreBottom,
  getAnchorDate: () => props.lastMessageDateInList,
});

const onIntersect = async (
  pause: () => void,
  resume: () => void,
  direction: DIRECTION,
  anchorMessageDate: string,
): Promise<void> => {
  pause();
  isPrepending.value = true;
  if (direction === DIRECTION.BEFORE) saveScrollPosition();

  if (props.chat?.id) {
    await props.onFetchMessages(props.chat.id, {
      direction,
      cursorCreatedAt: anchorMessageDate,
    });
  }

  await nextTick();
  if (direction === DIRECTION.BEFORE) {
    const el = scroller.value?.$el;
    if (!el) return;
    const heightDiff = el.scrollHeight - prevScrollHeight.value;
    el.scrollTop = prevScrollTop.value + heightDiff;
  }

  isPrepending.value = false;
  resume();
};

onUnmounted(() => {
  emit('unmount');
});

watch(
  () => props.messages.length,
  (value) => {
    const isReadyToScroll =
      value !== 0 && !isPrepending.value && !props.isFoundBySearch;
    if (!isReadyToScroll) return;
    scrollToBottom(!isInitialScroll.value);
    isInitialScroll.value = false;
  },
);
</script>

<template>
  <PinnedMessages
    :pinned-messages="pinnedMessages"
    @unpin-message="(id) => emit('unpin-message', id)"
    @click-pinned="(id) => emit('click-pinned', id)"
  />
  <div class="flex-1 p-6 bg-[var(--bg-primary)] relative overflow-hidden">
    <div v-if="messages.length > 0" class="h-full">
      <DynamicScroller
        :ref="REF_SCROLLER"
        :items="messages"
        :min-item-size="MIN_MESSAGE_SIZE"
        class="scroller"
        :key-field="MESSAGE_KEY"
      >
        <template
          #default="{
            item,
            index,
            active,
          }: {
            item: IMessage;
            index: number;
            active: boolean;
          }"
        >
          <DynamicScrollerItem
            :size-dependencies="[item.content]"
            :item="item"
            :active="active"
            :data-index="index"
          >
            <MessageCard
              :ref="
                (el) =>
                  initRefs({
                    createdAt: item.createdAt,
                    el,
                    id: item.id,
                  } as IRefPayload)
              "
              :generated-summary="generatedSummary"
              :user-id="userId"
              :message="item"
              :is-anchor="
                item.id === props.anchorMessageId && props.isFoundBySearch
              "
              class="pb-6"
              @context="
                ({ event, message }) =>
                  emit('open-context-menu', { event, message })
              "
            />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
    <EmptyChat v-else />
    <ContextMenu
      side="left"
      :is-visible="contextMenu.isVisible"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      :events="contextEvents"
    />
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

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useIntersectionObserver } from '#imports';
import {
  computed,
  nextTick,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue';
import type {
  IChat,
  IContextMenu,
  IGetMessageQuery,
  IMessage,
} from '~/shared/types';
import { DIRECTION, MIN_MESSAGE_SIZE, REFS } from './const';

import type MessageCard from './MessageCard.vue';
import Pinned from './Pinned.vue';
import Dropdown from '../ui/Dropdown.vue';

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

const props = defineProps<IProps>();

const emit = defineEmits<IEmits>();

const scroller = useTemplateRef(REFS.REF_SCROLLER);
const targetMessageTop = ref<InstanceType<typeof MessageCard> | null>(null);
const targetMessageBottom = ref<InstanceType<typeof MessageCard> | null>(null);

const isInitialScroll = ref(true);
const isPrepending = ref(false);
const prevScrollHeight = ref(0);
const prevScrollTop = ref(0);
const isReadyToScroll = ref(false);

const hasScrolledToAnchor = ref(false);

const anchorIndex = computed(() => {
  if (!props.anchorMessageId) return -1;
  return props.messages.findIndex((m) => m.id === props.anchorMessageId);
});

const initRefs = async (createdAt: string, el: any, id: string) => {
  if (createdAt === props.firstMessageDateInList) {
    targetMessageTop.value = el;
  } else if (targetMessageTop.value === el) {
    targetMessageTop.value = null;
  }

  if (createdAt === props.lastMessageDateInList) {
    targetMessageBottom.value = el;
  } else if (targetMessageBottom.value === el) {
    targetMessageBottom.value = null;
  }

  if (id === props.anchorMessageId && !hasScrolledToAnchor.value) {
    if (!el?.$el || !scroller.value) return;
    await nextTick();
    await nextTick();
    scroller.value.scrollToItem(anchorIndex.value);
    hasScrolledToAnchor.value = true;
  }
};

const scrollToBottom = async (smooth: boolean) => {
  await nextTick();
  if (!scroller.value) return;
  const el = scroller.value.$el || scroller.value;

  el.style.scrollBehavior = smooth ? 'smooth' : 'auto';
  scroller.value.scrollToBottom();
};

const saveScrollPosition = () => {
  const el = scroller.value?.$el;
  if (!el) return;
  prevScrollHeight.value = el.scrollHeight;
  prevScrollTop.value = el.scrollTop;
};

const createIntersectionObserver = (
  target: any,
  direction: DIRECTION,
  hasMore: () => boolean,
  getAnchorDate: () => string | undefined,
) => {
  const observer = useIntersectionObserver([target], async ([entry]) => {
    if (
      !entry?.isIntersecting ||
      !scroller.value?.$el ||
      !target.value ||
      !hasMore()
    )
      return;

    const anchorDate = getAnchorDate();
    if (!anchorDate) return;

    await onIntersect(observer.pause, observer.resume, direction, anchorDate);
  });
  return observer;
};

createIntersectionObserver(
  targetMessageTop,
  DIRECTION.BEFORE,
  () => props.hasMoreTop,
  () => props.firstMessageDateInList,
);

createIntersectionObserver(
  targetMessageBottom,
  DIRECTION.AFTER,
  () => props.hasMoreBottom,
  () => props.lastMessageDateInList,
);

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
    isReadyToScroll.value =
      value !== 0 && !isPrepending.value && !props.isFoundBySearch;
    if (!isReadyToScroll.value) return;
    scrollToBottom(!isInitialScroll.value);
    isInitialScroll.value = false;
  },
);
</script>

<template>
  <Pinned
    :pinned-messages="pinnedMessages"
    @unpin-message="(id) => emit('unpin-message', id)"
    @click-pinned="(id) => emit('click-pinned', id)"
  />
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
                :ref="(el) => initRefs(item.createdAt, el, item.id)"
                :user-id="userId"
                :message="item"
                :is-anchor="
                  item.id === props.anchorMessageId && props.isFoundBySearch
                "
                @context="
                  ({ event, message }) =>
                    emit('open-context-menu', { event, message })
                "
              />
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </div>
    <MessageEmptySpace v-else />
    <Dropdown
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

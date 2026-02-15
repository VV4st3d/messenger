<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import Icon from './Icon.vue';

interface IEvent {
  label: string;
  callback: () => void;
  isDanger?: boolean;
  icon?: { name: string; color: string };
}

interface IProps {
  isVisible: boolean;
  positionX: number;
  positionY: number;
  events: IEvent[];
  side?: 'left' | 'right';
}

const props = withDefaults(defineProps<IProps>(), {
  side: 'right',
});

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0);

const updateWidth = () => (windowWidth.value = window.innerWidth);

onMounted(() => window.addEventListener('resize', updateWidth));
onUnmounted(() => window.removeEventListener('resize', updateWidth));
</script>

<template>
  <Transition name="dropdown-fade">
    <div
      v-if="isVisible"
      class="fixed z-50 min-w-[200px]"
      :style="{
        left: side === 'right' ? positionX + 'px' : 'auto',
        right: side === 'left' ? windowWidth - positionX + 'px' : 'auto',
        top: positionY + 'px',
        transformOrigin: side === 'left' ? 'top right' : 'top left',
      }"
    >
      <div
        class="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] backdrop-blur-md p-1.5 flex flex-col gap-0.5 overflow-hidden"
      >
        <button
          v-for="event in events"
          :key="event.label"
          class="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 outline-none"
          :class="[
            event.isDanger
              ? 'text-red-400 hover:bg-red-500/10 active:bg-red-500/20'
              : 'text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)] active:scale-[0.98]',
          ]"
          @click="event.callback()"
        >
          <Icon
            v-if="event.icon"
            is-not-default
            :name="event.icon?.name"
            class="mr-1"
            :style="{ color: event.icon.color }"
            size="20"
          />
          {{ event.label }}
        </button>
      </div>
    </div>
  </Transition>
</template>

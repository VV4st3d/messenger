<script setup lang="ts">
import { computed } from 'vue';
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
  verticalSide?: 'top' | 'bottom';
}

const props = withDefaults(defineProps<IProps>(), {
  side: 'right',
  verticalSide: 'bottom',
});

const dropdownStyle = computed(() => {
  const translateX = props.side === 'left' ? '-100%' : '0';
  const translateY = props.verticalSide === 'top' ? '-100%' : '0';

  return {
    left: `${props.positionX}px`,
    top: `${props.positionY}px`,
    transform: `translate(${translateX}, ${translateY})`,
    transformOrigin: `${props.verticalSide} ${props.side}`,
  };
});
</script>

<template>
  <Teleport to="body">
    <Transition name="dropdown">
      <div
        v-if="isVisible"
        class="fixed z-50 min-w-[130px]"
        :style="dropdownStyle"
      >
        <div class="dropdown-content">
          <div
            class="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] backdrop-blur-md p-1.5 flex flex-col gap-0.5 overflow-hidden"
          >
            <button
              v-for="event in events"
              :key="event.label"
              class="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 outline-none whitespace-nowrap"
              :class="[
                event.isDanger
                  ? 'text-red-400 hover:bg-red-500/10 active:bg-red-500/20'
                  : 'text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)] active:scale-[0.98]',
              ]"
              @click="event.callback"
            >
              <Icon
                v-if="event.icon?.name"
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
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dropdown-enter-active .dropdown-content,
.dropdown-leave-active .dropdown-content {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-enter-from .dropdown-content,
.dropdown-leave-to .dropdown-content {
  opacity: 0;
  transform: scale(0.95);
}

.dropdown-enter-to .dropdown-content,
.dropdown-leave-from .dropdown-content {
  opacity: 1;
  transform: scale(1);
}
</style>

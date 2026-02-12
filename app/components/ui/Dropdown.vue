<script setup lang="ts">
interface IEvent {
  label: string;
  callback: () => void;
  isDanger?: boolean;
}

interface IProps {
  isVisible: boolean;
  positionX: number;
  positionY: number;
  events: IEvent[];
}

defineProps<IProps>();
</script>

<template>
  <Transition name="dropdown-fade">
    <div
      v-if="isVisible"
      class="fixed z-50 min-w-[200px] overflow-hidden"
      :style="{
        left: positionX + 'px',
        top: positionY + 'px',
      }"
    >
      <div
        class="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] backdrop-blur-md p-1.5 flex flex-col gap-0.5"
      >
        <button
          v-for="event in events"
          :key="event.label"
          class="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 outline-none"
          :class="[
            event.isDanger
              ? 'text-red-400 hover:bg-red-500/10 active:bg-red-500/20'
              : 'text-[var(--text-primary)] hover:bg-[var(--accent)] active:scale-[0.98]',
          ]"
          @click="event.callback()"
        >
          <span class="flex-1 text-left">{{ event.label }}</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.15s ease-out;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>

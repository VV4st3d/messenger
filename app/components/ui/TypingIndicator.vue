<script setup lang="ts">
defineProps<{
  show: boolean;
}>();
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="flex items-center space-x-2 w-fit rounded-2xl rounded-bl-none shadow-sm"
    >
      <div class="flex space-x-1">
        <span
          class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce [animation-delay:-0.3s]"
        />
        <span
          class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce [animation-delay:-0.15s]"
        />
        <span
          class="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full animate-bounce"
        />
      </div>
      <span class="text-xs font-medium text-[var(--text-secondary)] ml-1"
        >Печатает</span
      >
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

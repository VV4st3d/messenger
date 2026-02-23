<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { computed } from 'vue';

const props = defineProps<{
  align?: 'left' | 'right' | 'center';
  placement?: 'top' | 'bottom' | 'left' | 'right';
}>();

const alignClass = computed(() => {
  if (props.align === 'right') return 'right-0';
  if (props.align === 'center') return 'left-1/2 -translate-x-1/2';
  return 'left-0';
});

const placementClass = computed(() => {
  switch (props.placement) {
    case 'top':
      return 'bottom-full mb-2';
    case 'left':
      return 'right-full mr-2';
    case 'right':
      return 'left-full ml-2';
    default:
      return 'top-full mt-2';
  }
});
</script>

<template>
  <Popover>
    <PopoverButton class="relative" as="div">
      <slot name="button" />
    </PopoverButton>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <PopoverPanel
        :class="[
          'absolute z-50',
          placementClass,
          alignClass,
          'rounded-[var(--radius-lg)] bg-[var(--bg-secondary)]',
          'border border-[var(--border)] shadow-[var(--shadow-lg)]',
        ]"
      >
        <div class="p-2 max-h-[70vh] overflow-y-auto">
          <slot name="content" />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

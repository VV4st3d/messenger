<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import { computed } from 'vue';

interface Props {
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const model = defineModel<boolean>();

const props = withDefaults(defineProps<Props>(), {
  width: 'md',
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
}>();

const close = () => emit('update:modelValue', false);

const widthClass = computed(() => {
  switch (props.width) {
    case 'sm':
      return 'max-w-sm';
    case 'lg':
      return 'max-w-lg';
    case 'xl':
      return 'max-w-xl';
    default:
      return 'max-w-md';
  }
});
</script>

<template>
  <TransitionRoot :show="model" as="template">
    <Dialog class="relative z-[100]" @close="close">
      <TransitionChild
        enter="transition-opacity duration-150"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity duration-100"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          enter="transition duration-150"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="transition duration-100"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            :class="[
              'w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[var(--shadow-lg)]',
              widthClass,
            ]"
          >
            <div
              v-if="$slots.header"
              class="px-4 py-3 border-b border-[var(--border)]"
            >
              <slot name="header" />
            </div>

            <div class="p-4">
              <slot />
            </div>

            <div
              v-if="$slots.footer"
              class="px-4 py-3 border-t border-[var(--border)] flex justify-end gap-2"
            >
              <slot name="footer" />
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

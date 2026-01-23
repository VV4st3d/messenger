<script setup lang="ts">
interface Props {
  loading?: boolean;
  disabled?: boolean;
  loadingText?: string;
  type?: 'button' | 'submit' | 'reset';
}

withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  loadingText: 'Загрузка...',
  type: 'button',
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="w-full py-3 bg-[var(--accent)] text-white rounded-[var(--radius)] font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition"
  >
    <slot v-if="!loading" />
    <span v-else>{{ loadingText }}</span>
  </button>
</template>

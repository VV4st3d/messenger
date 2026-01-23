<script lang="ts" setup>
const model = defineModel<string>();

defineProps<{
  placeholder: string;
  onEnter?: () => Promise<void>;
  label: string;
}>();
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-[var(--text-secondary)] mb-2">
      {{ label }}
    </label>
    <input
      v-model="model"
      type="text"
      :placeholder="placeholder"
      class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
      @keyup.enter="onEnter"
    >
  </div>
</template>

<style lang="scss" scoped></style>

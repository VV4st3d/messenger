<script setup lang="ts">
import Gallery from '../ui/Gallery.vue';

defineProps<{ bio: string | undefined | null }>();
const photos: string[] = [];
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-12 space-y-10">
    <div
      class="rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--shadow)] p-7 transition hover:shadow-[var(--shadow-lg)]"
    >
      <h3 class="text-lg font-semibold text-[var(--text-secondary)] mb-4">
        О себе
      </h3>
      <p class="text-[var(--text-primary)] leading-relaxed">{{ bio ?? '' }}</p>
    </div>

    <div
      class="rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--shadow)] overflow-hidden"
    >
      <div
        class="flex border-b border-[var(--border)] bg-[var(--bg-tertiary)]/40"
      >
        <div
          class="flex-1 py-4 text-center font-medium text-[var(--accent)] relative"
        >
          Фото
        </div>
      </div>

      <Gallery :photos="photos" />
    </div>
  </div>
</template>

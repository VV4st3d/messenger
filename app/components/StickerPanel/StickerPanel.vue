<script setup lang="ts">
import Icon from '../ui/Icon.vue';
import { stickers } from '../../shared/const/emoji';

const emit = defineEmits<{
  (e: 'send-sticker', sticker: string): void;
}>();
</script>

<template>
  <div class="sticker-panel">
    <div class="panel-header">
      <Icon name="face-smile" size="20" class="text-[var(--accent)]" />
      <span class="text-sm font-medium text-[var(--text-secondary)]"
        >Стикеры</span
      >
    </div>

    <div class="sticker-grid">
      <button
        v-for="(sticker, index) in stickers"
        :key="index"
        class="sticker-item"
        @click="emit('send-sticker', sticker.emoji)"
      >
        <span class="sticker-emoji">{{ sticker.emoji }}</span>
      </button>
    </div>

    <div class="panel-footer">
      <span class="text-xs text-[var(--text-tertiary)]"
        >{{ stickers.length }} стикеров</span
      >
    </div>
  </div>
</template>

<style scoped>
.sticker-panel {
  max-height: 360px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-tertiary);
}

.panel-header .text-sm {
  font-weight: 600;
  letter-spacing: 0.3px;
}

.sticker-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  padding: 4px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.sticker-grid::-webkit-scrollbar {
  width: 6px;
}

.sticker-grid::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.sticker-item {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  background: none;
  border-radius: var(--radius);
  transition: all 0.18s ease;
  cursor: pointer;
}

.sticker-item:hover {
  background: none;
  transform: scale(1.08);
}

.sticker-emoji {
  font-size: 1.5rem;
  line-height: 1;
  transition: transform 0.2s ease;
}

.sticker-item:hover .sticker-emoji {
  transform: scale(1.25);
}

.panel-footer {
  padding: 8px 12px;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-tertiary);
}
</style>

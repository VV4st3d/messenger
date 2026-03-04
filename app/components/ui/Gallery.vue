<script setup lang="ts">
import { ref } from 'vue';
import Icon from './Icon.vue';
import { getUploadsRoute } from '~/shared/const/apiRoutes';

defineProps<{ photos: string[] }>();

const emit = defineEmits<{
  (e: 'upload', file: File): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

const openFilePicker = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) {
    emit('upload', input.files[0]);
    input.value = '';
  }
};
</script>

<template>
  <div class="p-7">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      <button
        class="aspect-square rounded-[var(--radius)] bg-[var(--bg-tertiary)] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center hover:border-[var(--accent)] hover:bg-[var(--bg-tertiary-hover)] transition-all duration-300"
        @click="openFilePicker"
      >
        <Icon name="plus" size="32" class="text-[var(--text-tertiary)] mb-2" />
        <span class="text-sm text-[var(--text-secondary)]">Добавить фото</span>
      </button>

      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="group aspect-square rounded-[var(--radius)] overflow-hidden bg-[var(--bg-tertiary)] transition duration-300 cursor-pointer"
      >
        <img
          :src="getUploadsRoute(photo)"
          alt="Фото"
          class="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        >
      </div>
    </div>

    <div
      v-if="!photos.length"
      class="py-16 text-center text-[var(--text-tertiary)]"
    >
      <Icon
        is-not-default
        name="famicons:image-sharp"
        size="48"
        class="mx-auto mb-4 opacity-50"
      />
      <p class="text-lg font-medium">Пока нет фото</p>
      <p class="mt-2 text-sm">
        Нажмите «Добавить фото», чтобы загрузить первое
      </p>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    >
  </div>
</template>

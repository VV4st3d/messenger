<script setup lang="ts">
defineProps<{ photos: string[] }>();
</script>

<template>
  <div class="p-7">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="group aspect-square rounded-[var(--radius)] overflow-hidden bg-[var(--bg-tertiary)] transition duration-300"
      >
        <img
          :src="photo"
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
        size="24"
        class="mx-auto mb-4 opacity-50"
      />
      <p class="text-lg font-medium">Пока нет фото</p>
    </div>
  </div>
</template>

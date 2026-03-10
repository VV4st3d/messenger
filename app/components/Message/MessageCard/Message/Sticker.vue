<script setup lang="ts">
import { useIntersectionObserver } from '#imports';
import type { Lottie } from 'nuxt-lottie';
import { ref, useTemplateRef } from 'vue';

defineProps<{ stickerName: string }>();

const LOTTIE = 'lottieElement';
const LOTTIE_CONTAINER = 'container';

const lottieElement = ref<Lottie | null>(null);
const lottieContainer = useTemplateRef<HTMLDivElement>(LOTTIE_CONTAINER);
const isAnimatingSticker = ref(false);
const isVisible = ref(false);

const playStickerAnimation = () => {
  if (lottieElement.value && !isAnimatingSticker.value) {
    lottieElement.value.goToAndPlay(0);
    isAnimatingSticker.value = true;
  }
};
useIntersectionObserver(lottieContainer, async ([entry]) => {
  if (!entry) return;
  if (entry?.isIntersecting) {
    console.log(entry);

    isVisible.value = true;
  }
});
</script>

<template>
  <div :ref="LOTTIE_CONTAINER" class="h-full">
    <ClientOnly>
      <LazyLottie
        v-if="isVisible"
        :ref="LOTTIE"
        :height="200"
        :link="`/stickers/${stickerName}.json`"
        :loop="1"
        @click="playStickerAnimation"
        @on-complete="isAnimatingSticker = false"
      />
    </ClientOnly>
  </div>
</template>

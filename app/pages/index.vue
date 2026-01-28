<script lang="ts" setup>
import { useNuxtApp } from '#app';
import { useAuthStore } from '#imports';
import { onMounted } from 'vue';

const { $socket } = useNuxtApp();
const authStore = useAuthStore();

onMounted(() => {
  // authStore.bindEvents()
  // $socket.connect();
});

// onUnmounted(() => {
//   $socket.disconnect();
// });
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

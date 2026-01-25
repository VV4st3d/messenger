<script lang="ts" setup>
import { useNuxtApp } from '#app';
import { onMounted, onUnmounted } from 'vue';

const { $socket } = useNuxtApp();

onMounted(() => {
  $socket.connect();
});

onUnmounted(() => {
  $socket.disconnect();
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
import { useNuxtApp } from '#app';
import { onMounted } from 'vue';

const { $socket } = useNuxtApp();

onMounted(() => {
  $socket.connect();
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { getUploadsRoute } from '~/shared/const/apiRoutes';
defineProps<{ filePath: string }>();
</script>

<template>
  <img
    loading="lazy"
    :src="getUploadsRoute(`/uploads${filePath}`)"
    alt="attachment"
    class="w-full h-full object-cover block"
  >
</template>

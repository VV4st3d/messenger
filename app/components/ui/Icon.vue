<template>
  <Icon 
    :name="iconName" 
    :size="size"
    v-bind="$attrs" 
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  size?: '16' | '20' | '24';
}>();

const iconName = computed(() => {
  return `heroicons:${props.name}`;
});
</script>

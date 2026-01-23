<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  size?: '16' | '20' | '24';
}>();

const iconName = computed(() => {
  return `heroicons:${props.name}-solid`;
});
</script>

<template>
  <Icon mode="svg" :name="iconName" :size="size" v-bind="$attrs" />
</template>

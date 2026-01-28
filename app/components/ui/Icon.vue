<script setup lang="ts">
import { computed } from 'vue';

type sizeValues = '14' | '16' | '20' | '24';

const props = defineProps<{
  name: string;
  size?: sizeValues;
}>();

const iconName = computed(() => {
  return `heroicons:${props.name}-solid`;
});
</script>

<template>
  <Icon mode="svg" :name="iconName" :size="size" v-bind="$attrs" />
</template>

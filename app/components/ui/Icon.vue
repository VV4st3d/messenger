<script setup lang="ts">
import { computed } from 'vue';

type TSizeValues = '14' | '16' | '20' | '24';

const props = defineProps<{
  name: string;
  size?: TSizeValues;
  isNotDefault?: boolean;
}>();

const iconName = computed(() => {
  return props.isNotDefault ? props.name : `heroicons:${props.name}-solid`;
});
</script>

<template>
  <Icon mode="svg" :name="iconName" :size="size" v-bind="$attrs" />
</template>

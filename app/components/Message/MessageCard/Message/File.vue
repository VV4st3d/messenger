<script setup lang="ts">
import Icon from '~/components/ui/Icon.vue';
import { getUploadsRoute } from '~/shared/const/apiRoutes';
import type { IMessage } from '~/shared/types';

const props = defineProps<{ file: IMessage }>();

const fileExtension =
  props.file?.filePath?.split('/').pop()?.toUpperCase() || 'FILE';
</script>

<template>
  <img
    v-if="file.type === 'image'"
    loading="lazy"
    :src="getUploadsRoute(`/uploads${file.filePath}`)"
    alt="attachment"
    class="w-full h-full object-cover block max-w-[320px] aspect-[4/5] sm:aspect-[5/6] bg-gray-100 transition-opacity hover:opacity-90"
  >

  <div
    v-else
    class="flex items-center gap-3 p-3 w-fit min-w-[200px] max-w-[320px] rounded-xl transition-colors cursor-pointer group"
  >
    <div
      class="flex items-center justify-center w-12 h-12 rounded-lg group-hover:scale-105 transition-transform"
    >
      <Icon is-not-default name="teenyicons:file-outline" class="w-6 h-6" />
    </div>

    <div class="flex flex-col overflow-hidden text-sm">
      <span class="font-medium text-gray-900 truncate">
        {{ file.filePath?.split('/').pop() }}
      </span>
      <span class="text-xs text-gray-500 uppercase font-bold">
        {{ fileExtension }}
      </span>
    </div>
    <a :href="getUploadsRoute(`/uploads${file.filePath}`)" download>
      <Icon
        is-not-default
        name="material-symbols:download"
        size="32"
        class="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      />
    </a>
  </div>
</template>

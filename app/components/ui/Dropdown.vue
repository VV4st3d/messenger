<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { computed } from 'vue';

interface IItem {
  label: string;
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}

interface IProps {
  dropdownItems: IItem[];
  vertical?: 'up' | 'down';
  horizontal?: 'left' | 'right';
}

const props = withDefaults(defineProps<IProps>(), {
  vertical: 'down',
  horizontal: 'right',
});

const positionClasses = computed(() => {
  const vertical =
    props.vertical === 'up'
      ? 'bottom-full mb-2 origin-bottom'
      : 'top-full mt-2 origin-top';

  const horizontal = props.horizontal === 'left' ? 'left-0' : 'right-0';

  return `${vertical} ${horizontal}`;
});
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton class="flex items-center">
      <slot />
    </MenuButton>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <MenuItems
        :class="[
          'absolute z-50 w-52 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[var(--shadow-lg)] p-1 focus:outline-none',
          positionClasses,
        ]"
      >
        <MenuItem
          v-for="item in dropdownItems"
          :key="item.label"
          v-slot="{ active }"
          :disabled="item.disabled"
        >
          <NuxtLink
            v-if="item.href"
            :to="item.href"
            :class="[
              'flex w-full items-center rounded-[var(--radius-sm)] px-3 py-2 text-sm transition',
              active
                ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                : 'text-[var(--text-primary)]',
              item.disabled && 'opacity-60 cursor-not-allowed',
            ]"
          >
            {{ item.label }}
          </NuxtLink>
          <button
            v-else
            :class="[
              'flex w-full items-center rounded-[var(--radius-sm)] px-3 py-2 text-sm transition',
              active
                ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                : 'text-[var(--text-primary)]',
              item.disabled && 'opacity-60 cursor-not-allowed',
            ]"
            @click="item.onClick"
          >
            {{ item.label }}
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

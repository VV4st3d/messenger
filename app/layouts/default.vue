<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Icon from '~/components/ui/Icon.vue';
import { useAuth } from '~/composables/useAuth';
import { LOCALSTORAGE_THEME_KEY, Themes } from '~/shared/const';

const { isAuthenticated } = useAuth();

const showSidebar = ref(false);
const isDark = ref(true);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle(Themes.LIGHT_THEME, !isDark.value);
  localStorage.setItem(
    LOCALSTORAGE_THEME_KEY,
    isDark.value ? Themes.DARK_THEME : Themes.LIGHT_THEME,
  );
};

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

const restoreTheme = () => {
  const savedTheme = localStorage.getItem(LOCALSTORAGE_THEME_KEY);
  if (savedTheme === Themes.LIGHT_THEME) {
    isDark.value = false;
    document.documentElement.classList.add(Themes.LIGHT_THEME);
  }
};

onMounted(() => {
  restoreTheme();
});
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]"
  >
    <header
      class="bg-[var(--bg-secondary)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between"
    >
      <button
        class="md:hidden text-2xl p-2 hover:text-[var(--accent)] transition"
        @click="toggleSidebar"
      >
        <Icon :name="'bars-3'" class="w-8 h-8" />
      </button>

      <h1 class="text-xl font-bold tracking-tight">Messenger</h1>

      <div class="flex items-center gap-4">
        <button
          class="text-xl p-2 hover:text-[var(--accent)] transition cursor-pointer"
          @click="toggleTheme"
        >
          <Icon
            v-if="!isDark"
            :name="'moon'"
            :variant="'outline'"
            class="w-6 h-6"
          />
          <Icon v-else :name="'sun'" :variant="'outline'" class="w-6 h-6" />
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden relative">
      <aside
        v-if="isAuthenticated"
        :class="[
          'fixed md:static inset-y-0 left-0 z-40 w-80 bg-[var(--bg-secondary)] border-r border-[var(--border)] transform transition-transform duration-300 ease-in-out',
          showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ]"
      >
        <Sidebar @close="showSidebar = false" />
      </aside>

      <main class="flex-1 flex flex-col overflow-hidden">
        <slot />
      </main>

      <div
        v-if="showSidebar"
        class="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm transition-opacity duration-300"
        @click="showSidebar = false"
      />
    </div>
  </div>
</template>

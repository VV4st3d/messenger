<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useRouter } from "vue-router";
import Sidebar from "~/components/Sidebar.vue";

// const { isAuthenticated, user } = useAuth();

const user: { avatarUrl?: string } = {};
const isAuthenticated = false;

const router = useRouter();

const showSidebar = ref(false);
const isDark = ref(true);

const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.classList.toggle("light", !isDark.value);
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

onMounted(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        isDark.value = false;
        document.documentElement.classList.add("light");
    }
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
                @click="showSidebar = !showSidebar"
                class="md:hidden text-2xl p-2 hover:text-[var(--accent)] transition"
            >
                <UiIcon :name="'bars-3'" class="w-8 h-8" />
            </button>

            <h1 class="text-xl font-bold tracking-tight">Messenger</h1>

            <div class="flex items-center gap-4">
                <button
                    @click="toggleTheme"
                    class="text-xl p-2 hover:text-[var(--accent)] transition cursor-pointer"
                >
                    <UiIcon
                        v-if="!isDark"
                        :name="'moon'"
                        :variant="'outline'"
                        class="w-6 h-6"
                    />
                    <UiIcon
                        v-else
                        :name="'sun'"
                        :variant="'outline'"
                        class="w-6 h-6"
                    />
                </button>
            </div>
        </header>

        <div class="flex flex-1 overflow-hidden relative">
            <aside  v-if="isAuthenticated"
                :class="[
                    'fixed md:static inset-y-0 left-0 z-40 w-80 bg-[var(--bg-secondary)] border-r border-[var(--border)] transform transition-transform duration-300 ease-in-out',
                    showSidebar
                        ? 'translate-x-0'
                        : '-translate-x-full md:translate-x-0',
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

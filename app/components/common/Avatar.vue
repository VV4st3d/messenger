<script setup lang="ts">
interface Props {
    src?: string;
    size?: "sm" | "md" | "lg";
    online?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    size: "md",
    src: "",
    online: false,
});

const hasError = ref(false);

const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
};

const statusSize = {
    sm: "w-3 h-3 bottom-0 right-0 border-2",
    md: "w-3.5 h-3.5 bottom-0.5 right-0.5 border-2",
    lg: "w-4 h-4 bottom-1 right-1 border-2",
};
</script>

<template>
    <div class="relative inline-flex flex-shrink-0" :class="sizeClasses[size]">
        <div
            class="w-full h-full flex items-center justify-center overflow-hidden bg-[var(--bg-tertiary)] rounded-full"
        >
            <img
                v-if="src && !hasError"
                :src="src"
                alt="Avatar"
                class="w-full h-full object-cover"
                @error="hasError = true"
            />

            <svg v-else viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path
                    stroke="var(--border)"
                    d="m 8 1 c -1.65625 0 -3 1.34375 -3 3 s 1.34375 3 3 3 s 3 -1.34375 3 -3 s -1.34375 -3 -3 -3 z m -1.5 7 c -2.492188 0 -4.5 2.007812 -4.5 4.5 v 0.5 c 0 1.109375 0.890625 2 2 2 h 8 c 1.109375 0 2 -0.890625 2 -2 v -0.5 c 0 -2.492188 -2.007812 -4.5 -4.5 -4.5 z m 0 0"
                    fill="var(--text-tertiary)"
                />
            </svg>
        </div>

        <div
            v-if="online"
            style="bottom: 0; right: 0;"
            class="absolute rounded-full bg-[var(--online)] border-2 border-[var(--bg-secondary)]"
            :class="statusSize[size]"
        ></div>
    </div>
</template>


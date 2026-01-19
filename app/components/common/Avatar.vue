<script setup lang="ts">
interface Props {
    src?: string;
    size?: "sm" | "md" | "lg";
}
const props = defineProps<Props>();

const { size = "md", src = "default/avatar-default.svg" } = props;

const hasError = ref(false);

watch(
    () => props.src,
    () => {
        hasError.value = false;
    }
);

const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
};

</script>

<template>
    <div
        :class="[
            'relative inline-flex items-center justify-center overflow-hidden rounded-full',
            sizeClasses[size],
        ]"
    >
        <img
            v-if="!hasError"
            :src="src"
            alt="User Avatar"
            class="h-full w-full object-cover"
            @error="hasError = true"
        />
    </div>
</template>

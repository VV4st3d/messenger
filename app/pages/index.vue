<script lang="ts" setup>
const authStore = useAuthStore()

</script>

<template>
    <div>
        Main Page {{ authStore.user }}
        <NuxtPage />
    </div>
</template>

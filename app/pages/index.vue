<script lang="ts" setup>
const authStore = useAuthStore()

const {$socket} = useNuxtApp()

onMounted(() =>{
  $socket.connect()
})
</script>

<template>
    <div>
        <NuxtPage />
    </div>
</template>

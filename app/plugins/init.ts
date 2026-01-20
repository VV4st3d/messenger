export default defineNuxtPlugin({
    name: "init",
    parallel: true,
    dependsOn: ["fetch"],
    async setup() {
        const route = useRoute();
        if (route.path === "/auth") return;
        const { $api } = useNuxtApp();
        const authStore = useAuthStore();

        try {
            const response = await $api.auth.me();
            if (response.success) {
                authStore.setUser(response.data);
            } else {
                authStore.setUser(null);
            }
        } catch (e) {
            authStore.setUser(null);
            console.log(e);
        }
    },
});

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();

    if (!authStore.user && to.path !== "/auth") return navigateTo("/auth");
});

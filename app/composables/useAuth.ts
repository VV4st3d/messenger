export function useAuth(){
    const authStore = useAuthStore()
    const user = authStore.user
    const isAuthenticated = ref(false)

    if (user) {
        isAuthenticated.value = true
    }else{
        isAuthenticated.value = false
    }

    return {
        user, isAuthenticated
    }
}
import { defineStore } from "pinia";
import type { User } from "~/types/user";

export const useAuthStore = defineStore('auth', ()=>{
    const user = ref<User | null>()

    const setUser = (usr: User | null) => user.value = usr

    const token = useCookie('AUTH_TOKEN', {
        maxAge: 60*60*24*7,
        watch: true
    })

    return {user, setUser, token}
})
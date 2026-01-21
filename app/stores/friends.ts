import { defineStore } from "pinia";
import type { User } from "~/types/auth";
import type { Friend } from "~/types/friends";

export const useFriendsStore = defineStore('friends', ()=>{
    const friends = ref<Friend[] | []>([])

    const setFriends = (data: Friend[]) => friends.value = data 


    return {friends, setFriends}
})
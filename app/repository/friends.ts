import type { Friends } from "~/types/friends";

export function createFriendsRepository(appFetch: typeof $fetch) {
  return {
    getFriends(){
      return appFetch<Friends>("friends", {method: "GET"})
    },
  };
}

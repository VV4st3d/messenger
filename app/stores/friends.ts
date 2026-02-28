import { useNuxtApp } from '#app';
import { useProfileStore } from '#imports';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type {
  IFoundUser,
  IUser,
  IFriendIncoming,
  IFriendOutgoing,
} from '~/shared/types';

export const useFriendsStore = defineStore('friends', () => {
  const friends = ref<IUser[]>([]);
  const foundUsers = ref<IFoundUser[]>([]);
  const incomingRequests = ref<IFriendIncoming[]>([]);
  const outgoingRequests = ref<IFriendOutgoing[]>([]);
  const { $api } = useNuxtApp();
  const profileStore = useProfileStore();

  const setFriends = (payload: IUser[]) => (friends.value = payload);
  const setFoundUsers = (payload: IFoundUser[]) => (foundUsers.value = payload);
  const setIncoming = (payload: IFriendIncoming[] = []) =>
    (incomingRequests.value = payload);
  const setOutgoing = (payload: IFriendOutgoing[] = []) =>
    (outgoingRequests.value = payload);

  const fetchFriends = async (): Promise<void> => {
    try {
      const { data = [] } = await $api.friend.getFriends();
      setFriends(data);
    } catch (error) {
      console.error('error during finding friends: ', error);
    }
  };

  const fetchUsers = async (query: { q: string }): Promise<void> => {
    try {
      const { data = [] } = await $api.friend.searchForFriends(query);
      setFoundUsers(data);
    } catch (error) {
      console.error('error during finding users: ', error);
    }
  };

  const removeFriend = async (id: string): Promise<void> => {
    try {
      const { removedFriendId } = await $api.friend.removeFriend(id);
      if (removedFriendId)
        friends.value = friends.value.filter(
          (friend) => friend.id !== removedFriendId,
        );
      profileStore.setFriendRequestStatus('none');
    } catch (error) {
      console.error('error during removing friend: ', error);
    }
  };

  const fetchFriendsRequests = async (): Promise<void> => {
    try {
      const [incomingData, outgoingData] = await Promise.all([
        $api.friend.searchIncomingRequests(),
        $api.friend.searchOutgoingRequests(),
      ]);
      setIncoming(incomingData.data);
      setOutgoing(outgoingData.data);
    } catch (error) {
      console.error('error during finding friends requests: ', error);
    }
  };

  const sendRequest = async (companionId: string): Promise<void> => {
    try {
      const { data: requestData } = await $api.friend.sendFriendRequest({
        toUserId: companionId,
      });
      const { data = [] } = await $api.friend.searchOutgoingRequests();
      setOutgoing(data);
      profileStore.setFriendRequestStatus('sent');
      profileStore.setFriendRequestId(requestData.id);
    } catch (error) {
      console.error('error during sendind request: ', error);
    }
  };

  const acceptRequest = async (id: string): Promise<void> => {
    try {
      const { data } = await $api.friend.acceptRequest(id);
      friends.value.push(data.fromUser);
      incomingRequests.value = incomingRequests.value.filter(
        (request) => request.id !== data.id,
      );
      profileStore.setFriendRequestStatus('friends');
    } catch (error) {
      console.error('error during accepting friend request: ', error);
    }
  };

  const rejectRequest = async (id: string): Promise<void> => {
    try {
      await $api.friend.rejectRequest(id);
      incomingRequests.value = incomingRequests.value.filter(
        (request) => request.id !== id,
      );
      profileStore.setFriendRequestStatus('none');
    } catch (error) {
      console.error('error during rejecting friend request: ', error);
    }
  };

  const cancelRequest = async (id: string): Promise<void> => {
    try {
      const { success } = await $api.friend.cancelRequest(id);
      if (success)
        outgoingRequests.value = outgoingRequests.value.filter(
          (request) => request.id !== id,
        );
      profileStore.setFriendRequestStatus('none');
    } catch (error) {
      console.error('error during canceling friend request: ', error);
    }
  };

  return {
    friends,
    foundUsers,
    setFriends,
    fetchFriends,
    fetchUsers,
    fetchFriendsRequests,
    incomingRequests,
    outgoingRequests,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    sendRequest,
    removeFriend,
  };
});

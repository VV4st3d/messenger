<script setup lang="ts">
import {
  computed,
  getStatus,
  navigateTo,
  onMounted,
  useFriendsStore,
  useNuxtApp,
  useProfileStore,
} from '#imports';
import { useRoute } from 'vue-router';
import ProfileHeader from '~/components/Profile/ProfileHeader.vue';
import { ROUTES } from '~/shared/const';

const { params } = useRoute();
const profileId = params.id as string;
const profileStore = useProfileStore();
const {
  acceptRequest,
  rejectRequest,
  cancelRequest,
  sendRequest,
  removeFriend,
} = useFriendsStore();
const profile = computed(() => profileStore.profile);
const { $api } = useNuxtApp();

const status = getStatus(() => profile.value?.isOnline);

const getOrCreateChatHandler = async (companionId: string): Promise<void> => {
  try {
    const { data } = await $api.chats.createOrGetPrivateChat({
      companionId,
    });
    navigateTo(ROUTES.getRouteChat(data.id));
  } catch (error) {
    console.log('Ошибка при создании/поиске чата', error);
  }
};

onMounted(() => {
  profileStore.fetchProfile(profileId);
});
</script>

<template>
  <div
    v-if="profile"
    class="overflow-auto profile min-h-screen bg-[var(--bg-primary)] font-[var(--font-primary)]"
  >
    <ProfileHeader
      :profile="profile"
      :status="status"
      @chat-open="getOrCreateChatHandler"
      @accept-request="acceptRequest"
      @cancel-request="cancelRequest"
      @delete-friend="removeFriend"
      @send-request="sendRequest"
      @reject-request="rejectRequest"
    />

    <ProfileBody :bio="profile.bio" />
  </div>
</template>

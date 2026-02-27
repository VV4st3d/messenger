<script setup lang="ts">
import {
  computed,
  getStatus,
  onMounted,
  useProfileStore,
} from '#imports';
import { useRoute } from 'vue-router';
import ProfileHeader from '~/components/Profile/ProfileHeader.vue';

const { params } = useRoute();
const profileId = params.id as string;
const profileStore = useProfileStore();
const profile = computed(() => profileStore.profile);

const status = getStatus(() => profile.value?.isOnline);

onMounted(() => {
  profileStore.fetchProfile(profileId);
});
</script>

<template>
  <div
    class="overflow-auto profile min-h-screen bg-[var(--bg-primary)] font-[var(--font-primary)]"
  >
    <ProfileHeader :profile="profile" :status="status" />

    <ProfileBody :bio="profile?.bio" />
  </div>
</template>

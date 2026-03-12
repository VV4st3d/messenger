<script setup lang="ts">
import { computed, ref } from 'vue';
import Icon from '~/components/ui/Icon.vue';
import { navigateTo, useAsyncData, useProfileStore } from '#imports';
import { useRoute } from 'vue-router';
import { ROUTES } from '~/shared/const';
import { getUploadsRoute } from '~/shared/const/apiRoutes';

const { params } = useRoute();
const profileId = params.id as string;

const profileStore = useProfileStore();
const profile = computed(() => profileStore.profile);

const username = ref(profile.value?.username || '');
const displayName = ref(profile.value?.displayName || '');
const bio = ref(profile.value?.bio ?? '');

const avatarUrl = ref<string | null>(profile.value?.avatarUrl || null);
const previewAvatar = ref(avatarUrl.value || '');
const inputAvatar = ref<File | null>(null);

const getAvatarUrl = computed(() => {
  if (previewAvatar.value?.startsWith('/uploads')) {
    return getUploadsRoute(previewAvatar.value);
  }
  return previewAvatar.value;
});

const handleAvatarChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) {
    inputAvatar.value = input.files[0];
    previewAvatar.value = URL.createObjectURL(inputAvatar.value);
  }
};

const saveProfileHandler = async () => {
  try {
    await profileStore.updateProfile({
      avatarUrl: inputAvatar.value,
      bio: bio.value.trim(),
      displayName: displayName.value.trim(),
      username: username.value.trim(),
    });
    navigateTo(ROUTES.getRouteProfile(profileId));
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
  }
};

await useAsyncData(`profile-${profileId}`, async () => {
  await profileStore.fetchProfile(profileId);
  return true;
});
</script>

<template>
  <div class="bg-[var(--bg-primary)] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-10 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Редактировать профиль
        </h1>
        <p class="mt-2 text-[var(--text-secondary)]">
          Измените информацию о себе
        </p>
      </div>

      <div
        class="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden"
      >
        <div class="p-8 border-b border-[var(--border-subtle)] text-center">
          <ClientOnly>
            <div class="relative inline-block mb-4">
              <div
                v-if="previewAvatar"
                class="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-[var(--bg-primary)] shadow-[var(--shadow)]"
              >
                <img
                  :src="getAvatarUrl"
                  alt="Аватар"
                  class="w-full h-full object-cover rounded-full"
                >
              </div>
              <div
                v-else
                class="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[var(--bg-tertiary)] border-4 border-[var(--border)] flex items-center justify-center shadow-[var(--shadow)]"
              >
                <Icon
                  name="user"
                  size="64"
                  class="text-[var(--text-tertiary)]"
                />
              </div>

              <label
                class="absolute bottom-0 right-0 p-2 bg-[var(--accent)] rounded-full cursor-pointer hover:bg-[var(--accent-hover)] transition shadow-[var(--shadow-sm)]"
              >
                <Icon name="camera" size="20" class="text-white" />
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarChange"
                >
              </label>
            </div>
          </ClientOnly>

          <p class="text-sm text-[var(--text-tertiary)]">
            Нажмите на камеру, чтобы изменить фото
          </p>
        </div>

        <div class="p-6 sm:p-8 space-y-8">
          <div>
            <label
              class="block text-sm font-medium text-[var(--text-secondary)] mb-2"
            >
              Никнейм (@username)
            </label>
            <input
              v-model="username"
              type="text"
              class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
              placeholder="@username"
            >
          </div>

          <div>
            <label
              class="block text-sm font-medium text-[var(--text-secondary)] mb-2"
            >
              Отображаемое имя
            </label>
            <input
              v-model="displayName"
              type="text"
              class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
              placeholder="Как вас будут видеть другие"
            >
          </div>

          <div>
            <label
              class="block text-sm font-medium text-[var(--text-secondary)] mb-2"
            >
              О себе
            </label>
            <textarea
              v-model="bio"
              rows="4"
              class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition resize-none"
              placeholder="Расскажите о себе в нескольких предложениях..."
            />
          </div>
        </div>

        <div
          class="px-6 sm:px-8 py-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row gap-4 justify-end"
        >
          <button
            class="btn btn-secondary px-6 py-3"
            @click="navigateTo(ROUTES.getRouteProfile(profileId))"
          >
            Отмена
          </button>
          <button class="btn btn-primary px-8 py-3" @click="saveProfileHandler">
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { navigateTo, useNuxtApp } from '#app';
import { useAuthStore } from '#imports';
import { computed, reactive, ref, toRefs } from 'vue';
import { AUTH_STEP } from '~/components/Auth/const';
import Login from '~/components/Auth/Login.vue';
import Register from '~/components/Auth/Register.vue';
import { RouteNames } from '~/shared/const';

interface IAuthForm {
  email: string;
  username: string;
  password: string;
}

const { $api } = useNuxtApp();
const authStore = useAuthStore();

const step = ref<AUTH_STEP>(AUTH_STEP.EMAIL);
const authForm = reactive<IAuthForm>({
  email: '',
  username: '',
  password: '',
});

const { email, password, username } = toRefs(authForm);

const loading = ref(false);
const error = ref('');

const setStep = (payload: AUTH_STEP) => {
  step.value = payload;
};

const isRegDisabled = computed(
  () => !username.value.trim() || !password.value.trim(),
);

const isLoginDisabled = computed(() => !password.value.trim());
const isDisabledContinue = computed(() => !email.value.trim());

const handleCheckEmail = async () => {
  if (!email.value.trim()) return;

  loading.value = true;
  error.value = '';

  try {
    const { data } = await $api.auth.checkExist({ email: email.value });
    step.value = data.exists ? AUTH_STEP.LOGIN : AUTH_STEP.REGISTER;
  } catch (err: any) {
    error.value = err.data.message || 'Непредвиденная ошибка';
  } finally {
    loading.value = false;
  }
};

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.loginHandler({
      email: email.value,
      password: password.value,
    });
    navigateTo({ name: RouteNames.MAIN });
  } catch (err: any) {
    error.value = err.data.message || 'Ошибка при авторизации';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  loading.value = true;
  try {
    await authStore.registerHandler({
      email: email.value,
      password: password.value,
      username: username.value,
    });
    navigateTo({ name: RouteNames.MAIN });
  } catch (err: any) {
    error.value = err.data.message || 'Ошибка при регистрации';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4"
  >
    <div
      class="w-full max-w-md bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden"
    >
      <div class="p-8 border-b border-[var(--border)] text-center">
        <h1 class="text-3xl font-bold text-[var(--text-primary)]">Messenger</h1>
        <p class="mt-2 text-[var(--text-secondary)]">Вход или регистрация</p>
      </div>

      <div class="p-8">
        <div v-if="step === AUTH_STEP.EMAIL" class="space-y-6">
          <UiInput
            v-model="email"
            :on-enter="handleCheckEmail"
            label="Email"
            placeholder="example@email.com"
          />

          <UiButton
            :loading="loading"
            :disabled="isDisabledContinue"
            loading-text="Проверка..."
            @click="handleCheckEmail"
          >
            Продолжить
          </UiButton>

          <p v-if="error" class="text-[var(--danger)] text-sm text-center mt-4">
            {{ error }}
          </p>
        </div>

        <div v-else-if="step === AUTH_STEP.LOGIN" class="space-y-6">
          <Login
            v-model="password"
            :set-step="setStep"
            :error="error"
            :is-disabled="isLoginDisabled"
            :step="step"
            :handle-login="handleLogin"
            :is-loading="loading"
          />
        </div>

        <div v-else-if="step === AUTH_STEP.REGISTER" class="space-y-6">
          <Register
            v-model:password="password"
            v-model:username="username"
            :set-step="setStep"
            :is-loading="loading"
            :step="step"
            :handle-register="handleRegister"
            :is-disabled="isRegDisabled"
            :error="error"
          />
        </div>
      </div>
    </div>
  </div>
</template>

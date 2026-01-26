<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { navigateTo, useNuxtApp } from '#app';
import { useAuthStore } from '#imports';
import { computed, reactive, ref, toRefs } from 'vue';
import { RouteNames } from '~/shared/const';

type TAuthStep = 'email' | 'login' | 'register';

interface IAuthForm {
  email: string;
  username: string;
  password: string;
}

const isRegDisbaled = computed(
  () => !username.value.trim() || !password.value.trim(),
);

const step = ref<TAuthStep>('email');
const authForm = reactive<IAuthForm>({
  email: '',
  username: '',
  password: '',
});

const { email, password, username } = toRefs(authForm);

const loading = ref(false);
const error = ref('');

const { $api } = useNuxtApp();

const authStore = useAuthStore();

const handleCheckEmail = async () => {
  if (!email.value.trim()) return;

  loading.value = true;
  error.value = '';

  try {
    await $api.auth.checkExist({ email: email.value });
    step.value = 'login';
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
    error.value = err.data.message || 'Ошибка ввода пароля';
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
        <div v-if="step === 'email'" class="space-y-6">
          <UiInput
            v-model="email"
            :on-enter="handleCheckEmail"
            label="Email"
            placeholder="example@email.com"
          />

          <UiButton
            :loading="loading"
            :disabled="!email.trim()"
            loading-text="Проверка..."
            @click="handleCheckEmail"
          >
            Продолжить
          </UiButton>

          <p v-if="error" class="text-[var(--danger)] text-sm text-center mt-4">
            {{ error }}
          </p>
        </div>

        <div v-else-if="step === 'login'" class="space-y-6">
          <UiInput
            v-model="password"
            :on-enter="handleLogin"
            label="Пароль"
            placeholder="••••••••"
          />

          <UiButton
            :loading="loading"
            :disabled="!password.trim()"
            loading-text="Вход..."
            @click="handleLogin"
          >
            Войти
          </UiButton>

          <button
            class="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm mt-4"
            @click="step = 'email'"
          >
            ← Изменить email
          </button>

          <p v-if="error" class="text-[var(--danger)] text-sm text-center mt-4">
            {{ error }}
          </p>
        </div>

        <div v-else-if="step === 'register'" class="space-y-6">
          <UiInput
            v-model="username"
            label="Username"
            placeholder="Ваше имя в чате"
          />

          <UiInput
            v-model="password"
            :on-enter="handleRegister"
            label="Пароль"
            placeholder="Придумайте надёжный пароль"
          />

          <UiButton
            :loading="loading"
            :disabled="isRegDisbaled"
            loading-text="Регистрация..."
            @click="handleRegister"
          >
            Зарегистрироваться
          </UiButton>

          <button
            class="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm mt-4"
            @click="step = 'email'"
          >
            ← Изменить email
          </button>

          <p v-if="error" class="text-[var(--danger)] text-sm text-center mt-4">
            {{ error }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

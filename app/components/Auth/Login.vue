<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, navigateTo, ref, type useAuthStore } from '#imports';
import { RouteNames } from '~/shared/const';
import type { AUTH_STEP as TAuthStep } from './const';
import { AUTH_STEP } from './const';
import Input from '../ui/Input.vue';
import Button from '../ui/Button.vue';

const password = ref('');
interface IProps {
  authStore: ReturnType<typeof useAuthStore>;
  isLoading: boolean;
  email: string;
  step: TAuthStep;
  error: string | undefined;
  setError: (e: string) => void;
  setLoading: (value: boolean) => void;
  setStep: (arg: AUTH_STEP) => void;
}
const props = defineProps<IProps>();

const handleLogin = async () => {
  props.setLoading(true);
  try {
    await props.authStore.login({
      email: props.email,
      password: password.value,
    });
    navigateTo({ name: RouteNames.MAIN });
  } catch (err: any) {
    props.setError(err.data.message || 'Ошибка при авторизации');
  } finally {
    props.setLoading(false);
  }
};

const isLoginDisabled = computed(() => !password.value.trim());
</script>

<template>
  <Input
    v-model="password"
    :on-enter="handleLogin"
    label="Пароль"
    placeholder="••••••••"
  />

  <Button
    :loading="isLoading"
    :disabled="isLoginDisabled"
    loading-text="Вход..."
    @click="handleLogin"
  >
    Войти
  </Button>

  <button
    class="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm mt-4"
    @click="setStep(AUTH_STEP.EMAIL)"
  >
    ← Изменить email
  </button>

  <p v-if="error" class="text-[var(--danger)] text-sm text-center mt-4">
    {{ error }}
  </p>
</template>

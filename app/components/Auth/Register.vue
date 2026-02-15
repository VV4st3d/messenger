<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, navigateTo, ref, type useAuthStore } from '#imports';
import { RouteNames } from '~/shared/const';
import type { AUTH_STEP as TAuthStep } from './const';
import { AUTH_STEP } from './const';
import Input from '../ui/Input.vue';
import Button from '../ui/Button.vue';

const username = ref('');
const password = ref('');
interface IProps {
  authStore: ReturnType<typeof useAuthStore>;
  isLoading: boolean;
  step: TAuthStep;
  email: string;
  error: string | undefined;
  setStep: (arg: TAuthStep) => void;
  setError: (error: string) => void;
  setLoading: (value: boolean) => void;
}
const props = defineProps<IProps>();

const handleRegister = async () => {
  props.setLoading(true);
  try {
    await props.authStore.rigester({
      email: props.email,
      password: password.value,
      username: username.value,
    });
    navigateTo({ name: RouteNames.MAIN });
  } catch (err: any) {
    props.setError(err.data.message || 'Ошибка при регистрации');
  } finally {
    props.setLoading(false);
  }
};

const isRegistrationButtonDisabled = computed(
  () => !username.value.trim() || !password.value.trim(),
);
</script>

<template>
  <Input v-model="username" label="Username" placeholder="Ваше имя в чате" />

  <Input
    v-model="password"
    :on-enter="handleRegister"
    label="Пароль"
    placeholder="Придумайте надёжный пароль"
  />

  <Button
    :loading="isLoading"
    :disabled="isRegistrationButtonDisabled"
    loading-text="Регистрация..."
    @click="handleRegister"
  >
    Зарегистрироваться
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

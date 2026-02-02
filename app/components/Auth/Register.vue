<script setup lang="ts">
import type { AUTH_STEP as TAuthStep } from './const';
import { AUTH_STEP } from './const';

const username = defineModel<string>('username');
const password = defineModel<string>('password');
interface IProps {
  handleRegister: () => Promise<void>;
  isLoading: boolean;
  isDisabled: boolean;
  step: TAuthStep;
  error: string | undefined;
  setStep: (arg: TAuthStep) => void;
}
defineProps<IProps>();
</script>

<template>
  <UiInput v-model="username" label="Username" placeholder="Ваше имя в чате" />

  <UiInput
    v-model="password"
    :on-enter="handleRegister"
    label="Пароль"
    placeholder="Придумайте надёжный пароль"
  />

  <UiButton
    :loading="isLoading"
    :disabled="isDisabled"
    loading-text="Регистрация..."
    @click="handleRegister"
  >
    Зарегистрироваться
  </UiButton>

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

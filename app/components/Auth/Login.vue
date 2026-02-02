<script setup lang="ts">
import type { AUTH_STEP as TAuthStep } from './const';
import { AUTH_STEP } from './const';

const password = defineModel<string>();
interface IProps {
  handleLogin: () => Promise<void>;
  isLoading: boolean;
  isDisabled: boolean;
  step: TAuthStep;
  error: string | undefined;
  setStep: (arg: AUTH_STEP) => void;
}
defineProps<IProps>();
</script>

<template>
  <UiInput
    v-model="password"
    :on-enter="handleLogin"
    label="Пароль"
    placeholder="••••••••"
  />

  <UiButton
    :loading="isLoading"
    :disabled="isDisabled"
    loading-text="Вход..."
    @click="handleLogin"
  >
    Войти
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

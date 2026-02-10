<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNuxtApp } from '#app';
import { useAuthStore } from '#imports';
import { computed, ref } from 'vue';
import { AUTH_STEP } from '~/components/Auth/const';
import Login from '~/components/Auth/Login.vue';
import Register from '~/components/Auth/Register.vue';
import Button from '~/components/ui/Button.vue';
import Input from '~/components/ui/Input.vue';

const { $api } = useNuxtApp();
const authStore = useAuthStore();

const step = ref<AUTH_STEP>(AUTH_STEP.EMAIL);
const email = ref('');

const loading = ref(false);
const error = ref('');

const setStep = (payload: AUTH_STEP) => {
  step.value = payload;
};

const setError = (payload: string) => {
  error.value = payload;
};
const setLoading = (payload: boolean) => {
  loading.value = payload;
};

const isDisabledContinue = computed(() => !email.value.trim());

const handleCheckEmail = async () => {
  if (!email.value.trim()) return;

  loading.value = true;
  error.value = '';

  try {
    const { data = [] } = await $api.auth.checkExist({ email: email.value });
    step.value = data.exists ? AUTH_STEP.LOGIN : AUTH_STEP.REGISTER;
  } catch (err: any) {
    error.value = err.data.message || 'Непредвиденная ошибка';
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
          <Input
            v-model="email"
            :on-enter="handleCheckEmail"
            label="Email"
            placeholder="example@email.com"
          />

          <Button
            :loading="loading"
            :disabled="isDisabledContinue"
            loading-text="Проверка..."
            @click="handleCheckEmail"
          >
            Продолжить
          </Button>

          <p v-if="error" class="text-[var(--danger)] text-sm text-center mt-4">
            {{ error }}
          </p>
        </div>

        <div v-else-if="step === AUTH_STEP.LOGIN" class="space-y-6">
          <Login
            :email="email"
            :auth-store="authStore"
            :set-loading="setLoading"
            :set-step="setStep"
            :error="error"
            :step="step"
            :is-loading="loading"
            :set-error="setError"
          />
        </div>

        <div v-else-if="step === AUTH_STEP.REGISTER" class="space-y-6">
          <Register
            :email="email"
            :set-step="setStep"
            :auth-store="authStore"
            :is-loading="loading"
            :step="step"
            :error="error"
            :set-loading="setLoading"
            :set-error="setError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

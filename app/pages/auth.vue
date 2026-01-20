<script setup lang="ts">
import { ref } from "vue";
import type { AuthStep } from "~/types/auth";

const step = ref<AuthStep>("email");
const authForm = reactive<{
    email: string;
    username: string;
    password: string;
}>({
    email: "",
    username: "",
    password: "",
});

const { email, password, username } = toRefs(authForm);

const loading = ref(false);
const error = ref("");

const api = useNuxtApp().$api;

const authStore = useAuthStore();

const setToken = (token: string) => {
    localStorage.setItem("AUTH_TOKEN", token);
    authStore.token = token;
};

const checkEmail = async () => {
    if (!email.value.trim()) return;

    loading.value = true;
    error.value = "";

    try {
        await api.auth.checkExist({ email: email.value });
        step.value = "login";
    } catch (err: any) {
        error.value = err.data.message || "Непредвиденная ошибка";
    } finally {
        loading.value = false;
    }
};

const login = async () => {
    loading.value = true;
    try {
        const { token } = await api.auth.login({
            email: email.value,
            password: password.value,
        });
        setToken(token);
        navigateTo({ name: "index" });
    } catch (err: any) {
        error.value = err.data.message || "Ошибка ввода пароля";
    } finally {
        loading.value = false;
    }
};

const register = async () => {
    loading.value = true;
    try {
        const { success, data } = await api.auth.registration({
            email: email.value,
            password: password.value,
            username: username.value,
        });
        setToken(data.token);
        navigateTo({ name: "index" });
    } catch (err: any) {
        error.value = err.data.message || "Ошибка при регистрации";
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
                <h1 class="text-3xl font-bold text-[var(--text-primary)]">
                    Messenger
                </h1>
                <p class="mt-2 text-[var(--text-secondary)]">
                    Вход или регистрация
                </p>
            </div>

            <div class="p-8">
                <div v-if="step === 'email'" class="space-y-6">
                    <UiInput
                        :callback="checkEmail"
                        label="Email"
                        v-model="email"
                        placeholder="example@email.com"
                    />

                    <UiButton
                        @click="checkEmail"
                        :loading="loading"
                        :disabled="!email.trim()"
                        loadingText="Проверка..."
                    >
                        Продолжить
                    </UiButton>

                    <p
                        v-if="error"
                        class="text-[var(--danger)] text-sm text-center mt-4"
                    >
                        {{ error }}
                    </p>
                </div>

                <div v-else-if="step === 'login'" class="space-y-6">
                    <UiInput
                        :callback="login"
                        label="Пароль"
                        v-model="password"
                        placeholder="••••••••"
                    />

                    <UiButton
                        @click="login"
                        :loading="loading"
                        :disabled="!password.trim()"
                        loadingText="Вход..."
                    >
                        Войти
                    </UiButton>

                    <button
                        @click="step = 'email'"
                        class="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm mt-4"
                    >
                        ← Изменить email
                    </button>

                    <p
                        v-if="error"
                        class="text-[var(--danger)] text-sm text-center mt-4"
                    >
                        {{ error }}
                    </p>
                </div>

                <div v-else-if="step === 'register'" class="space-y-6">
                    <UiInput
                        label="Username"
                        v-model="username"
                        placeholder="Ваше имя в чате"
                    />

                    <UiInput
                        :callback="register"
                        label="Пароль"
                        v-model="password"
                        placeholder="Придумайте надёжный пароль"
                    />

                    <UiButton
                        @click="register"
                        :loading="loading"
                        :disabled="!username.trim() || !password.trim()"
                        loadingText="Регистрация..."
                    >
                        Зарегистрироваться
                    </UiButton>

                    <button
                        @click="step = 'email'"
                        class="text-[var(--accent)] hover:text-[var(--accent-hover)] text-sm mt-4"
                    >
                        ← Изменить email
                    </button>

                    <p
                        v-if="error"
                        class="text-[var(--danger)] text-sm text-center mt-4"
                    >
                        {{ error }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

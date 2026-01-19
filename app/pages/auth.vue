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

const {email, password, username} = toRefs(authForm)

const loading = ref(false);
const error = ref("");

const api = useNuxtApp().$api;

const checkEmail = async () => {
    if (!email.value.trim()) return;

    loading.value = true;
    error.value = "";

    try {
        const { data } = await api.auth.checkExist({ email: email.value });
        if (data.exists) return (step.value = "login");
        step.value = "register";
    } catch (err: any) {
        error.value = err.message || "Ошибка проверки email";
    } finally {
        loading.value = false;
    }
};

const login = async () => {
    loading.value = true;
    try {
        const { success, token, data } = await api.auth.login({
            email: email.value,
            password: password.value,
        });
        localStorage.setItem("AUTH_TOKEN", token);
        navigateTo({ name: "index" });
    } catch (err: any) {
        error.value = err.message || "Ошибка проверки пароля";
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
        localStorage.setItem("AUTH_TOKEN", data.token);
        navigateTo({ name: "index" });
    } catch (err: any) {
        error.value = err.message || "Ошибка";
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
                    <div>
                        <label
                            class="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                        >
                            Email
                        </label>
                        <input
                            v-model="email"
                            type="email"
                            placeholder="example@email.com"
                            class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
                            @keyup.enter="checkEmail"
                        />
                    </div>

                    <button
                        @click="checkEmail"
                        :disabled="loading || !email.trim()"
                        class="w-full py-3 bg-[var(--accent)] text-white rounded-[var(--radius)] font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition"
                    >
                        {{ loading ? "Проверка..." : "Продолжить" }}
                    </button>

                    <p
                        v-if="error"
                        class="text-[var(--danger)] text-sm text-center mt-4"
                    >
                        {{ error }}
                    </p>
                </div>

                <div v-else-if="step === 'login'" class="space-y-6">
                    <div>
                        <label
                            class="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                        >
                            Пароль
                        </label>
                        <input
                            v-model="password"
                            type="password"
                            placeholder="••••••••"
                            class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
                            @keyup.enter="login"
                        />
                    </div>

                    <button
                        @click="login"
                        :disabled="loading || !password.trim()"
                        class="w-full py-3 bg-[var(--accent)] text-white rounded-[var(--radius)] font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition"
                    >
                        {{ loading ? "Вход..." : "Войти" }}
                    </button>

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
                    <div>
                        <label
                            class="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                        >
                            Username
                        </label>
                        <input
                            v-model="username"
                            type="text"
                            placeholder="Ваше имя в чате"
                            class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
                        />
                    </div>

                    <div>
                        <label
                            class="block text-sm font-medium text-[var(--text-secondary)] mb-2"
                        >
                            Пароль
                        </label>
                        <input
                            v-model="password"
                            type="password"
                            placeholder="Придумайте надёжный пароль"
                            class="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-[var(--radius)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition"
                            @keyup.enter="register"
                        />
                    </div>

                    <button
                        @click="register"
                        :disabled="
                            loading || !username.trim() || !password.trim()
                        "
                        class="w-full py-3 bg-[var(--accent)] text-white rounded-[var(--radius)] font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition"
                    >
                        {{ loading ? "Регистрация..." : "Зарегистрироваться" }}
                    </button>

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

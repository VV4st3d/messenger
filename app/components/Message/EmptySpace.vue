<script setup lang="ts"></script>

<template>
  <div
    class="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
  >
    <div
      class="w-24 h-24 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6"
    >
      <UiIcon
        name="chat-bubble-left-right"
        class="w-12 h-12 text-[var(--text-tertiary)]"
      />
    </div>
    <h3 class="text-xl font-semibold text-[var(--text-primary)] mb-3">
      Пока сообщений нет
    </h3>
    <p class="text-[var(--text-secondary)] max-w-md mb-8">Начните разговор!</p>
  </div>
</template>

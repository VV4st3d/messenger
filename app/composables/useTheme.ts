import { ref } from 'vue';
import { LOCALSTORAGE_THEME_KEY, Themes } from '~/shared/const';

const isDark = ref(true);

export const useTheme = () => {
  return {
    toggleTheme: () => {
      isDark.value = !isDark.value;
      document.documentElement.classList.toggle(
        Themes.LIGHT_THEME,
        !isDark.value,
      );
      localStorage.setItem(
        LOCALSTORAGE_THEME_KEY,
        isDark.value ? Themes.DARK_THEME : Themes.LIGHT_THEME,
      );
    },
    restoreTheme: () => {
      const savedTheme = localStorage.getItem(LOCALSTORAGE_THEME_KEY);
      if (savedTheme === Themes.LIGHT_THEME) {
        isDark.value = false;
        document.documentElement.classList.add(Themes.LIGHT_THEME);
      }
    },
    isDark,
  };
};

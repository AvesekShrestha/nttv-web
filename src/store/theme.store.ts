import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark', // Defaults to your dark blue theme
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        applyThemeClass(newTheme);
      },
      setTheme: (theme) => {
        set({ theme });
        applyThemeClass(theme);
      },
      initializeTheme: () => {
        applyThemeClass(get().theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

function applyThemeClass(theme: Theme) {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}

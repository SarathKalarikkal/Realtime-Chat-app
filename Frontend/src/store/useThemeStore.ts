import { create } from "zustand";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem("chat-theme") || 'coffee',
  setTheme: (theme:any) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));

export default useThemeStore;
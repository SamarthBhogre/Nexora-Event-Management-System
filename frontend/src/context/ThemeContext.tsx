import { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS, FEATURES } from '@utils/constants';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored !== null) {
      return stored === 'dark';
    }

    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return false;
  });

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const setTheme = (isDark: boolean) => {
    setIsDark(isDark);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark: FEATURES.DARK_MODE_ENABLED ? isDark : false,
        toggleTheme: FEATURES.DARK_MODE_ENABLED ? toggleTheme : () => {},
        setTheme: FEATURES.DARK_MODE_ENABLED ? setTheme : () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

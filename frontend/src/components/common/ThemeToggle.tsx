import { FC } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@hooks/useTheme';

const ThemeToggle: FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle;

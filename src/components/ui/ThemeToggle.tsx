'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg transition-all duration-300"
        aria-label="Toggle theme"
      >
        <div className="relative w-5 h-5">
          <Sun className="absolute inset-0 w-5 h-5 opacity-0" />
          <Moon className="absolute inset-0 w-5 h-5 opacity-0" />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg transition-all duration-300 hover:bg-opacity-10 hover:bg-gray-500 relative"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100 text-[#0F172A]' 
              : 'opacity-0 rotate-90 scale-50 text-[#F8FAFC]'
          }`}
        />
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100 text-[#F8FAFC]' 
              : 'opacity-0 -rotate-90 scale-50 text-[#0F172A]'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;

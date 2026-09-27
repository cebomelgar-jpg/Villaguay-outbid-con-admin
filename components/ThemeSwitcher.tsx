'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { themeManager, type Theme } from '@/lib/themeManager';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = themeManager.onThemeChange((newTheme) => {
      setTheme(newTheme);
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    themeManager.toggleTheme();
  };

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-panel border border-white/10 flex items-center justify-center">
        <Moon className="h-5 w-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 rounded-lg bg-panel border border-white/10 flex items-center justify-center hover:border-neon-purple/50 transition-all group"
      title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5 text-muted-foreground group-hover:text-neon-purple transition-colors" />
      ) : (
        <Sun className="h-5 w-5 text-muted-foreground group-hover:text-neon-purple transition-colors" />
      )}
    </button>
  );
}

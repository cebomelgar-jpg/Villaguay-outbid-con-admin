// Theme management for Dark/Light mode with neumorphic accents

export type Theme = 'dark' | 'light';

class ThemeManager {
  private currentTheme: Theme = 'dark';
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor() {
    // Load theme from localStorage or default to dark
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('villaguay-theme') as Theme;
      this.currentTheme = savedTheme === 'light' ? 'light' : 'dark';
      this.applyTheme(this.currentTheme);
    }
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Update CSS variables for theme-specific colors
    this.updateCSSVariables(theme);
  }

  private updateCSSVariables(theme: Theme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    if (theme === 'dark') {
      // Dark mode - Cyberpunk/Neo-Brutalist
      root.style.setProperty('--bg-primary', '#0a0a0f');
      root.style.setProperty('--bg-secondary', '#121216');
      root.style.setProperty('--bg-tertiary', '#1a1a20');
      root.style.setProperty('--bg-panel', 'rgba(18, 18, 22, 0.8)');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a1a1aa');
      root.style.setProperty('--text-muted', '#71717a');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.05)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.5)');
      
      // Neon colors (same for both themes, but adjusted for contrast)
      root.style.setProperty('--neon-purple', '#A855F7');
      root.style.setProperty('--neon-green', '#00FF87');
      root.style.setProperty('--neon-gold', '#FFD700');
      root.style.setProperty('--neon-blue', '#3B82F6');
      root.style.setProperty('--neon-pink', '#EC4899');
      root.style.setProperty('--neon-red', '#EF4444');
    } else {
      // Light mode - Modern gray with neumorphic accents
      root.style.setProperty('--bg-primary', '#F8FAFC');
      root.style.setProperty('--bg-secondary', '#F1F5F9');
      root.style.setProperty('--bg-tertiary', '#E2E8F0');
      root.style.setProperty('--bg-panel', 'rgba(255, 255, 255, 0.8)');
      root.style.setProperty('--text-primary', '#0f172a');
      root.style.setProperty('--text-secondary', '#475569');
      root.style.setProperty('--text-muted', '#64748b');
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.05)');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
      
      // Neon colors (adjusted for light backgrounds with higher contrast)
      root.style.setProperty('--neon-purple', '#7C3AED');
      root.style.setProperty('--neon-green', '#059669');
      root.style.setProperty('--neon-gold', '#D97706');
      root.style.setProperty('--neon-blue', '#2563EB');
      root.style.setProperty('--neon-pink', '#DB2777');
      root.style.setProperty('--neon-red', '#DC2626');
    }
  }

  toggleTheme(): Theme {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('villaguay-theme', this.currentTheme);
    }
    
    this.applyTheme(this.currentTheme);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentTheme));
    
    return this.currentTheme;
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('villaguay-theme', theme);
    }
    
    this.applyTheme(theme);
    
    // Notify listeners
    this.listeners.forEach(listener => listener(theme));
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  onThemeChange(callback: (theme: Theme) => void): () => void {
    this.listeners.add(callback);
    callback(this.currentTheme); // Call immediately with current theme
    return () => this.listeners.delete(callback);
  }

  // Check if we should use dark mode based on system preference
  getSystemTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}

// Singleton instance
export const themeManager = new ThemeManager();

// For non-React contexts
export const { toggleTheme, setTheme, getTheme } = themeManager;

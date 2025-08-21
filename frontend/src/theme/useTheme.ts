import { useState, useEffect, useCallback } from 'react';
import { themeManager, Theme } from './ThemeManager';

export interface UseThemeReturn {
  currentTheme: Theme;
  currentThemeName: string;
  availableThemes: string[];
  setTheme: (themeName: string) => void;
  isThemeLoaded: boolean;
}

export function useTheme(): UseThemeReturn {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themeManager.getCurrentTheme());
  const [currentThemeName, setCurrentThemeName] = useState<string>(themeManager.getCurrentThemeName());
  const [availableThemes, setAvailableThemes] = useState<string[]>(themeManager.getAvailableThemes());
  const [isThemeLoaded, setIsThemeLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Apply theme on mount
    themeManager.applyTheme();
    setIsThemeLoaded(true);

    // Listen for theme changes
    const handleThemeChange = () => {
      setCurrentTheme(themeManager.getCurrentTheme());
      setCurrentThemeName(themeManager.getCurrentThemeName());
    };

    // Create a custom event for theme changes
    window.addEventListener('themechange', handleThemeChange);

    return () => {
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  const setTheme = useCallback((themeName: string) => {
    themeManager.setTheme(themeName);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('themechange'));
    
    // Update state
    setCurrentTheme(themeManager.getCurrentTheme());
    setCurrentThemeName(themeManager.getCurrentThemeName());
  }, []);

  return {
    currentTheme,
    currentThemeName,
    availableThemes,
    setTheme,
    isThemeLoaded
  };
}

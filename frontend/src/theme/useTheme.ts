import { useState, useEffect, useCallback } from 'react';
import { themeManager, Theme } from './ThemeManager';
import { useAppSelector } from '../store/hooks';
import { userAPI } from '../utils/api';

export interface UseThemeReturn {
  currentTheme: Theme;
  currentThemeName: string;
  availableThemes: string[];
  setTheme: (themeName: string) => void;
  isThemeLoaded: boolean;
}

export function useTheme(): UseThemeReturn {
  const { user } = useAppSelector((state) => state.auth);
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

  // Apply user theme when user data changes
  useEffect(() => {
    if (user?.theme) {
      themeManager.setThemeFromUser(user.theme);
      setCurrentTheme(themeManager.getCurrentTheme());
      setCurrentThemeName(themeManager.getCurrentThemeName());
    }
  }, [user?.theme]);

  const setTheme = useCallback(async (themeName: string) => {
    themeManager.setTheme(themeName);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('themechange'));
    
    // Update state
    setCurrentTheme(themeManager.getCurrentTheme());
    setCurrentThemeName(themeManager.getCurrentThemeName());
    
    // Save theme to backend if user is authenticated
    if (user) {
      try {
        await userAPI.updateTheme(themeName);
      } catch (error) {
        console.error('Failed to save theme to backend:', error);
      }
    }
  }, [user]);

  return {
    currentTheme,
    currentThemeName,
    availableThemes,
    setTheme,
    isThemeLoaded
  };
}

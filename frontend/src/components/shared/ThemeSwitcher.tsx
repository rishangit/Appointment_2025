import React from 'react';
import { useThemeContext } from '../../theme/ThemeProvider';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'dropdown' | 'buttons';
}

export function ThemeSwitcher({ className = '', variant = 'dropdown' }: ThemeSwitcherProps) {
  const { currentThemeName, availableThemes, setTheme } = useThemeContext();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  const handleButtonClick = (themeName: string) => {
    setTheme(themeName);
  };

  if (variant === 'buttons') {
    return (
      <div className={`theme-switcher-buttons ${className}`}>
        <span className="theme-label">Theme:</span>
        <div className="theme-buttons">
          {availableThemes.map((themeName) => (
            <button
              key={themeName}
              onClick={() => handleButtonClick(themeName)}
              className={`theme-button ${currentThemeName === themeName ? 'active' : ''}`}
              style={{
                backgroundColor: currentThemeName === themeName ? 'var(--color-primary)' : 'var(--color-background-secondary)',
                color: currentThemeName === themeName ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                border: '1px solid var(--color-border-primary)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                fontSize: 'var(--font-size-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`theme-switcher-dropdown ${className}`}>
      <label htmlFor="theme-select" className="theme-label">
        Theme:
      </label>
      <select
        id="theme-select"
        value={currentThemeName}
        onChange={handleThemeChange}
        style={{
          backgroundColor: 'var(--color-background-card)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--spacing-xs) var(--spacing-sm)',
          fontSize: 'var(--font-size-sm)',
          cursor: 'pointer'
        }}
      >
        {availableThemes.map((themeName) => (
          <option key={themeName} value={themeName}>
            {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}

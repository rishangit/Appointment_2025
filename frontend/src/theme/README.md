# Theme System

This directory contains the theme system for the application, allowing for easy customization and switching between different visual themes.

## Structure

```
theme/
├── myInterior/           # MyInterior theme (based on colors.txt)
│   ├── colors.txt        # Original color palette
│   └── index.ts          # Theme configuration
├── modernDark/           # Modern dark theme example
│   └── index.ts          # Theme configuration
├── ThemeManager.ts       # Theme management logic
├── ThemeProvider.tsx     # React context provider
├── useTheme.ts          # React hook for theme usage
└── README.md            # This file
```

## Available Themes

### MyInterior Theme
Based on the colors from `myInterior/colors.txt`:
- Primary: `#1e2a44` (Dark blue-gray)
- Secondary: `#9bb8c6` (Light blue-gray)
- Accent: `#d6c6b8` (Warm beige)
- Background: `#fffdf9` (Off-white)
- Surface: `#a8a3a0` (Gray)

### Modern Dark Theme
A modern dark theme with:
- Primary: `#6366f1` (Indigo)
- Secondary: `#8b5cf6` (Violet)
- Accent: `#06b6d4` (Cyan)
- Dark backgrounds with high contrast

## Usage

### Basic Usage

```tsx
import { useThemeContext } from './theme/ThemeProvider';

function MyComponent() {
  const { currentTheme, setTheme, availableThemes } = useThemeContext();
  
  return (
    <div>
      <h1>Current theme: {currentTheme.name}</h1>
      <button onClick={() => setTheme('modernDark')}>
        Switch to Dark Theme
      </button>
    </div>
  );
}
```

### Theme Switcher Component

```tsx
import { ThemeSwitcher } from './components/shared/ThemeSwitcher';

// Dropdown variant
<ThemeSwitcher variant="dropdown" />

// Button variant
<ThemeSwitcher variant="buttons" />
```

### CSS Variables

The theme system automatically applies CSS variables to the document root. You can use these in your CSS:

```css
.my-component {
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  font-family: var(--font-fontFamily-primary);
  font-size: var(--font-fontSize-base);
  font-weight: var(--font-fontWeight-medium);
}
```

## Creating a New Theme

1. Create a new directory in the `theme` folder:
   ```
   theme/
   └── myNewTheme/
       └── index.ts
   ```

2. Define your theme configuration:

```tsx
export const myNewTheme = {
  name: 'myNewTheme',
  colors: {
    primary: '#your-primary-color',
    secondary: '#your-secondary-color',
    accent: '#your-accent-color',
    background: '#your-background-color',
    surface: '#your-surface-color',
    
    text: {
      primary: '#your-text-primary',
      secondary: '#your-text-secondary',
      inverse: '#your-text-inverse',
      muted: '#your-text-muted'
    },
    
    background: {
      primary: '#your-bg-primary',
      secondary: '#your-bg-secondary',
      tertiary: '#your-bg-tertiary',
      card: '#your-bg-card',
      sidebar: '#your-bg-sidebar',
      header: '#your-bg-header'
    },
    
    border: {
      primary: '#your-border-primary',
      secondary: '#your-border-secondary',
      accent: '#your-border-accent'
    },
    
    button: {
      primary: {
        background: '#your-button-primary-bg',
        text: '#your-button-primary-text',
        hover: '#your-button-primary-hover',
        active: '#your-button-primary-active'
      },
      secondary: {
        background: '#your-button-secondary-bg',
        text: '#your-button-secondary-text',
        hover: '#your-button-secondary-hover',
        active: '#your-button-secondary-active'
      },
      accent: {
        background: '#your-button-accent-bg',
        text: '#your-button-accent-text',
        hover: '#your-button-accent-hover',
        active: '#your-button-accent-active'
      }
    },
    
    status: {
      success: '#your-success-color',
      warning: '#your-warning-color',
      error: '#your-error-color',
      info: '#your-info-color'
    },
    
    shadow: {
      sm: 'your-small-shadow',
      md: 'your-medium-shadow',
      lg: 'your-large-shadow',
      xl: 'your-extra-large-shadow'
    }
  },
  
  typography: {
    fontFamily: {
      primary: 'your-primary-font',
      secondary: 'your-secondary-font'
    },
    
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px'
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};
```

3. Add your theme to the ThemeManager:

```tsx
// In ThemeManager.ts
import { myNewTheme } from './myNewTheme';

export const themes: Record<string, Theme> = {
  myInterior: myInteriorTheme,
  modernDark: modernDarkTheme,
  myNewTheme: myNewTheme, // Add your new theme here
};
```

## Theme Persistence

The selected theme is automatically saved to localStorage and restored when the application loads.

## Testing Themes

You can test themes by:
1. Using the theme switcher in the header
2. Visiting `/theme-showcase` to see a comprehensive theme demonstration
3. Using the `useThemeContext` hook in your components

## Best Practices

1. **Use CSS Variables**: Always use the CSS variables instead of hardcoded colors
2. **Semantic Naming**: Use semantic color names (primary, secondary, etc.) rather than specific color names
3. **Consistent Structure**: Follow the same structure as existing themes
4. **Accessibility**: Ensure sufficient contrast ratios between text and background colors
5. **Responsive Design**: Test themes across different screen sizes

## CSS Variables Reference

### Colors
- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-background`
- `--color-surface`
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-inverse`
- `--color-text-muted`
- `--color-background-primary`
- `--color-background-secondary`
- `--color-background-tertiary`
- `--color-background-card`
- `--color-background-sidebar`
- `--color-background-header`
- `--color-border-primary`
- `--color-border-secondary`
- `--color-border-accent`
- `--color-button-primary-background`
- `--color-button-primary-text`
- `--color-button-primary-hover`
- `--color-button-primary-active`
- `--color-button-secondary-background`
- `--color-button-secondary-text`
- `--color-button-secondary-hover`
- `--color-button-secondary-active`
- `--color-button-accent-background`
- `--color-button-accent-text`
- `--color-button-accent-hover`
- `--color-button-accent-active`
- `--color-status-success`
- `--color-status-warning`
- `--color-status-error`
- `--color-status-info`
- `--color-shadow-sm`
- `--color-shadow-md`
- `--color-shadow-lg`
- `--color-shadow-xl`

### Typography
- `--font-fontFamily-primary`
- `--font-fontFamily-secondary`
- `--font-fontSize-xs`
- `--font-fontSize-sm`
- `--font-fontSize-base`
- `--font-fontSize-lg`
- `--font-fontSize-xl`
- `--font-fontSize-2xl`
- `--font-fontSize-3xl`
- `--font-fontSize-4xl`
- `--font-fontWeight-normal`
- `--font-fontWeight-medium`
- `--font-fontWeight-semibold`
- `--font-fontWeight-bold`
- `--font-lineHeight-tight`
- `--font-lineHeight-normal`
- `--font-lineHeight-relaxed`

### Spacing
- `--spacing-xs`
- `--spacing-sm`
- `--spacing-md`
- `--spacing-lg`
- `--spacing-xl`
- `--spacing-2xl`
- `--spacing-3xl`

### Border Radius
- `--radius-sm`
- `--radius-md`
- `--radius-lg`
- `--radius-xl`
- `--radius-2xl`
- `--radius-full`

### Breakpoints
- `--breakpoint-sm`
- `--breakpoint-md`
- `--breakpoint-lg`
- `--breakpoint-xl`
- `--breakpoint-2xl`

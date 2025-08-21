import { myInteriorTheme, MyInteriorTheme } from './myInterior';
import { modernDarkTheme, ModernDarkTheme } from './modernDark';
import { driftwoodTheme } from './Driftwood';
import { ravenClawTheme } from './ravenClaw';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      inverse: string;
      muted: string;
    };
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      card: string;
      sidebar: string;
      header: string;
    };
    border: {
      primary: string;
      secondary: string;
      accent: string;
    };
    button: {
      primary: {
        background: string;
        text: string;
        hover: string;
        active: string;
      };
      secondary: {
        background: string;
        text: string;
        hover: string;
        active: string;
      };
      accent: {
        background: string;
        text: string;
        hover: string;
        active: string;
      };
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    shadow: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: string;
      normal: string;
      relaxed: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export const themes: Record<string, Theme> = {
  myInterior: myInteriorTheme,
  modernDark: modernDarkTheme,
  driftwood: driftwoodTheme,
  ravenClaw: ravenClawTheme,
  // Add more themes here as they are created
};

export class ThemeManager {
  private currentTheme: string = 'myInterior';

  constructor() {
    this.loadThemeFromStorage();
  }

  private loadThemeFromStorage(): void {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme && themes[savedTheme]) {
      this.currentTheme = savedTheme;
    }
  }

  private saveThemeToStorage(): void {
    localStorage.setItem('app-theme', this.currentTheme);
  }

  public getCurrentTheme(): Theme {
    return themes[this.currentTheme];
  }

  public getCurrentThemeName(): string {
    return this.currentTheme;
  }

  public setTheme(themeName: string): void {
    if (!themes[themeName]) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }

    this.currentTheme = themeName;
    this.saveThemeToStorage();
    this.applyTheme();
  }

  public getAvailableThemes(): string[] {
    return Object.keys(themes);
  }

  public applyTheme(): void {
    const theme = this.getCurrentTheme();
    const root = document.documentElement;

    // Apply color variables
    Object.entries(theme.colors).forEach(([category, values]) => {
      if (typeof values === 'string') {
        root.style.setProperty(`--color-${category}`, values);
      } else {
        Object.entries(values).forEach(([key, value]) => {
          if (typeof value === 'string') {
            root.style.setProperty(`--color-${category}-${key}`, value);
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => {
              root.style.setProperty(`--color-${category}-${key}-${subKey}`, subValue);
            });
          }
        });
      }
    });

    // Apply typography variables
    Object.entries(theme.typography).forEach(([category, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        root.style.setProperty(`--font-${category}-${key}`, value);
      });
    });

    // Apply spacing variables
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply border radius variables
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Apply breakpoint variables
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      root.style.setProperty(`--breakpoint-${key}`, value);
    });

    // Add theme class to body for additional styling
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ');
    document.body.classList.add(`theme-${theme.name}`);
  }

  public getThemeCSSVariables(): string {
    const theme = this.getCurrentTheme();
    let css = ':root {\n';

    // Color variables
    Object.entries(theme.colors).forEach(([category, values]) => {
      if (typeof values === 'string') {
        css += `  --color-${category}: ${values};\n`;
      } else {
        Object.entries(values).forEach(([key, value]) => {
          if (typeof value === 'string') {
            css += `  --color-${category}-${key}: ${value};\n`;
          } else if (typeof value === 'object') {
            Object.entries(value).forEach(([subKey, subValue]) => {
              css += `  --color-${category}-${key}-${subKey}: ${subValue};\n`;
            });
          }
        });
      }
    });

    // Typography variables
    Object.entries(theme.typography).forEach(([category, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        css += `  --font-${category}-${key}: ${value};\n`;
      });
    });

    // Spacing variables
    Object.entries(theme.spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`;
    });

    // Border radius variables
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      css += `  --radius-${key}: ${value};\n`;
    });

    // Breakpoint variables
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      css += `  --breakpoint-${key}: ${value};\n`;
    });

    css += '}';
    return css;
  }
}

// Create a singleton instance
export const themeManager = new ThemeManager();

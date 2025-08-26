export const modernDarkTheme = {
  name: 'modernDark',
  colors: {
    // Modern dark theme colors
    primary: '#6366f1',      // Indigo
    secondary: '#8b5cf6',    // Violet
    accent: '#06b6d4',       // Cyan
    surface: '#1e293b',      // Slate 800
    
    // Semantic colors
    text: {
      primary: '#f8fafc',    // Slate 50
      secondary: '#cbd5e1',  // Slate 300
      inverse: '#0f172a',    // Slate 900
      muted: '#64748b'       // Slate 500
    },
    
    background: {
      primary: '#0f172a',    // Slate 900
      secondary: '#1e293b',  // Slate 800
      tertiary: '#334155',   // Slate 700
      card: '#1e293b',       // Slate 800
      sidebar: '#0f172a',    // Slate 900
      header: '#1e293b'      // Slate 800
    },
    
    border: {
      primary: '#334155',    // Slate 700
      secondary: '#475569',  // Slate 600
      accent: '#6366f1'      // Indigo
    },
    
    button: {
      primary: {
        background: '#6366f1',
        text: '#ffffff',
        hover: '#4f46e5',
        active: '#4338ca'
      },
      secondary: {
        background: '#8b5cf6',
        text: '#ffffff',
        hover: '#7c3aed',
        active: '#6d28d9'
      },
      accent: {
        background: '#06b6d4',
        text: '#ffffff',
        hover: '#0891b2',
        active: '#0e7490'
      }
    },
    
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
    }
  },
  
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      secondary: 'JetBrains Mono, monospace'
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

export type ModernDarkTheme = typeof modernDarkTheme;

export const myInteriorTheme = {
  name: 'myInterior',
  colors: {
    // Primary colors from colors.txt
    primary: '#1e2a44',      // Dark blue-gray
    secondary: '#9bb8c6',    // Light blue-gray
    accent: '#d6c6b8',       // Warm beige
    surface: '#a8a3a0',      // Gray
    
    // Semantic colors derived from the palette
    text: {
      primary: '#1e2a44',
      secondary: '#a8a3a0',
      inverse: '#fffdf9',
      muted: '#9bb8c6'
    },
    
    background: {
      primary: '#fffdf9',
      secondary: '#f8f7f5',
      tertiary: '#f0efed',
      card: '#ffffff',
      sidebar: '#1e2a44',
      header: '#ffffff'
    },
    
    border: {
      primary: '#e5e7eb',
      secondary: '#d6c6b8',
      accent: '#9bb8c6'
    },
    
    button: {
      primary: {
        background: '#1e2a44',
        text: '#fffdf9',
        hover: '#2a3a5a',
        active: '#162238'
      },
      secondary: {
        background: '#9bb8c6',
        text: '#1e2a44',
        hover: '#8aa8b6',
        active: '#7a98a6'
      },
      accent: {
        background: '#d6c6b8',
        text: '#1e2a44',
        hover: '#c6b6a8',
        active: '#b6a698'
      }
    },
    
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    
    shadow: {
      sm: '0 1px 2px 0 rgba(30, 42, 68, 0.05)',
      md: '0 4px 6px -1px rgba(30, 42, 68, 0.1)',
      lg: '0 10px 15px -3px rgba(30, 42, 68, 0.1)',
      xl: '0 20px 25px -5px rgba(30, 42, 68, 0.1)'
    }
  },
  
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      secondary: 'Georgia, serif'
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

export type MyInteriorTheme = typeof myInteriorTheme;

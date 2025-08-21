export const driftwoodTheme = {
  name: 'Driftwood',
  colors: {
    // Primary colors from colors.txt
    primary: '#bcd4de',      // Light blue-gray
    secondary: '#a0b9bf',    // Medium blue-gray
    accent: '#949ba0',       // Dark gray
    background: '#ffffff',   // White
    surface: '#f8fafb',      // Light gray
    
    // Semantic colors derived from the palette
    text: {
      primary: '#2c3e50',
      secondary: '#5a6c7d',
      inverse: '#ffffff',
      muted: '#8e9ba8'
    },
    
    background: {
      primary: '#ffffff',
      secondary: '#f8fafb',
      tertiary: '#f0f4f7',
      card: '#ffffff',
      sidebar: '#bcd4de',
      header: '#ffffff'
    },
    
    border: {
      primary: '#e1e8ed',
      secondary: '#f0f4f7',
      accent: '#d1e0e5'
    },
    
    button: {
      primary: {
        background: '#bcd4de',
        text: '#2c3e50',
        hover: '#a5ccd1',
        active: '#9dacb2'
      },
      secondary: {
        background: '#a0b9bf',
        text: '#ffffff',
        hover: '#9dacb2',
        active: '#949ba0'
      },
      accent: {
        background: '#949ba0',
        text: '#ffffff',
        hover: '#7a8085',
        active: '#6b7176'
      }
    },
    
    status: {
      success: '#27ae60',
      warning: '#f39c12',
      error: '#e74c3c',
      info: '#3498db'
    },
    
    shadow: {
      sm: '0 1px 2px 0 rgba(44, 62, 80, 0.05)',
      md: '0 4px 6px -1px rgba(44, 62, 80, 0.1)',
      lg: '0 10px 15px -3px rgba(44, 62, 80, 0.15)',
      xl: '0 20px 25px -5px rgba(44, 62, 80, 0.25)'
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
}

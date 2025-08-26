export const ravenClawTheme = {
  name: 'RavenClaw',
  colors: {
    // Primary colors from colors.txt
    primary: '#1d2d5c',      // Deep navy blue
    secondary: '#8cc0c0',    // Teal
    accent: '#987046',       // Warm brown
    surface: '#f8f9fa',      // Light gray
    
    // Semantic colors derived from the palette
    text: {
      primary: '#444340',    // Dark charcoal
      secondary: '#5a6c7d',
      inverse: '#ffffff',
      muted: '#8e9ba8'
    },
    
    background: {
      primary: '#ffffff',
      secondary: '#f8f9fa',
      tertiary: '#f0f2f5',
      card: '#ffffff',
      sidebar: '#1d2d5c',
      header: '#ffffff'
    },
    
    border: {
      primary: '#e1e8ed',
      secondary: '#f0f2f5',
      accent: '#dbbe9f'
    },
    
    button: {
      primary: {
        background: '#1d2d5c',
        text: '#ffffff',
        hover: '#2a3d6b',
        active: '#162447'
      },
      secondary: {
        background: '#8cc0c0',
        text: '#ffffff',
        hover: '#7ab0b0',
        active: '#6aa0a0'
      },
      accent: {
        background: '#987046',
        text: '#ffffff',
        hover: '#8a6640',
        active: '#7c5c3a'
      }
    },
    
    status: {
      success: '#27ae60',
      warning: '#f39c12',
      error: '#e74c3c',
      info: '#3498db'
    },
    
    shadow: {
      sm: '0 1px 2px 0 rgba(29, 45, 92, 0.05)',
      md: '0 4px 6px -1px rgba(29, 45, 92, 0.1)',
      lg: '0 10px 15px -3px rgba(29, 45, 92, 0.15)',
      xl: '0 20px 25px -5px rgba(29, 45, 92, 0.25)'
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

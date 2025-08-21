import React from 'react';
import { useThemeContext } from '../../theme/ThemeProvider';
import { ThemeSwitcher } from './ThemeSwitcher';

export function ThemeShowcase() {
  const { currentTheme, availableThemes } = useThemeContext();

  return (
    <div className="theme-showcase" style={{
      padding: 'var(--spacing-xl)',
      backgroundColor: 'var(--color-background-primary)',
      color: 'var(--color-text-primary)',
      minHeight: '100vh'
    }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <h1 style={{
            fontSize: 'var(--font-fontSize-4xl)',
            fontWeight: 'var(--font-fontWeight-bold)',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--color-text-primary)'
          }}>
            Theme Showcase
          </h1>
          <p style={{
            fontSize: 'var(--font-fontSize-lg)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            Explore different themes for the application
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-2xl)'
          }}>
            <ThemeSwitcher variant="buttons" />
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          {/* Color Palette */}
          <div style={{
            backgroundColor: 'var(--color-background-card)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            border: '1px solid var(--color-border-primary)',
            boxShadow: 'var(--color-shadow-md)'
          }}>
            <h3 style={{
              fontSize: 'var(--font-fontSize-xl)',
              fontWeight: 'var(--font-fontWeight-semibold)',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--color-text-primary)'
            }}>
              Color Palette
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-md)'
            }}>
              <div style={{
                backgroundColor: 'var(--color-primary)',
                height: '60px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-inverse)',
                fontWeight: 'var(--font-fontWeight-medium)'
              }}>
                Primary
              </div>
              <div style={{
                backgroundColor: 'var(--color-secondary)',
                height: '60px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-primary)',
                fontWeight: 'var(--font-fontWeight-medium)'
              }}>
                Secondary
              </div>
              <div style={{
                backgroundColor: 'var(--color-accent)',
                height: '60px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-primary)',
                fontWeight: 'var(--font-fontWeight-medium)'
              }}>
                Accent
              </div>
              <div style={{
                backgroundColor: 'var(--color-surface)',
                height: '60px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-primary)',
                fontWeight: 'var(--font-fontWeight-medium)'
              }}>
                Surface
              </div>
            </div>
          </div>

          {/* Typography */}
          <div style={{
            backgroundColor: 'var(--color-background-card)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            border: '1px solid var(--color-border-primary)',
            boxShadow: 'var(--color-shadow-md)'
          }}>
            <h3 style={{
              fontSize: 'var(--font-fontSize-xl)',
              fontWeight: 'var(--font-fontWeight-semibold)',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--color-text-primary)'
            }}>
              Typography
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <h1 style={{
                fontSize: 'var(--font-fontSize-2xl)',
                fontWeight: 'var(--font-fontWeight-bold)',
                color: 'var(--color-text-primary)',
                margin: 0
              }}>
                Heading 1
              </h1>
              <h2 style={{
                fontSize: 'var(--font-fontSize-xl)',
                fontWeight: 'var(--font-fontWeight-semibold)',
                color: 'var(--color-text-primary)',
                margin: 0
              }}>
                Heading 2
              </h2>
              <p style={{
                fontSize: 'var(--font-fontSize-base)',
                color: 'var(--color-text-secondary)',
                margin: 0
              }}>
                Body text with secondary color
              </p>
              <small style={{
                fontSize: 'var(--font-fontSize-sm)',
                color: 'var(--color-text-muted)',
                margin: 0
              }}>
                Small text with muted color
              </small>
            </div>
          </div>

          {/* Buttons */}
          <div style={{
            backgroundColor: 'var(--color-background-card)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            border: '1px solid var(--color-border-primary)',
            boxShadow: 'var(--color-shadow-md)'
          }}>
            <h3 style={{
              fontSize: 'var(--font-fontSize-xl)',
              fontWeight: 'var(--font-fontWeight-semibold)',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--color-text-primary)'
            }}>
              Buttons
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <button style={{
                backgroundColor: 'var(--color-button-primary-background)',
                color: 'var(--color-button-primary-text)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                fontSize: 'var(--font-fontSize-base)',
                fontWeight: 'var(--font-fontWeight-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                Primary Button
              </button>
              <button style={{
                backgroundColor: 'var(--color-button-secondary-background)',
                color: 'var(--color-button-secondary-text)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                fontSize: 'var(--font-fontSize-base)',
                fontWeight: 'var(--font-fontWeight-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                Secondary Button
              </button>
              <button style={{
                backgroundColor: 'var(--color-button-accent-background)',
                color: 'var(--color-button-accent-text)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-sm) var(--spacing-lg)',
                fontSize: 'var(--font-fontSize-base)',
                fontWeight: 'var(--font-fontWeight-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                Accent Button
              </button>
            </div>
          </div>

          {/* Status Colors */}
          <div style={{
            backgroundColor: 'var(--color-background-card)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-xl)',
            border: '1px solid var(--color-border-primary)',
            boxShadow: 'var(--color-shadow-md)'
          }}>
            <h3 style={{
              fontSize: 'var(--font-fontSize-xl)',
              fontWeight: 'var(--font-fontWeight-semibold)',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--color-text-primary)'
            }}>
              Status Colors
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <div style={{
                backgroundColor: 'var(--color-status-success)',
                color: 'white',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-fontSize-sm)',
                fontWeight: 'var(--font-fontWeight-medium)'
              }}>
                Success Message
              </div>
              <div style={{
                backgroundColor: 'var(--color-status-warning)',
                color: 'white',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-fontSize-sm)',
                fontWeight: 'var(--font-fontWeight-medium)'
              }}>
                Warning Message
              </div>
              <div style={{
                backgroundColor: 'var(--color-status-error)',
                color: 'white',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-fontSize-sm)',
                fontWeight: 'var(--font-fontWeight-medium)'
              }}>
                Error Message
              </div>
              <div style={{
                backgroundColor: 'var(--color-status-info)',
                color: 'white',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-fontSize-sm)',
                fontWeight: 'var(--font-fontWeight-medium)'
              }}>
                Info Message
              </div>
            </div>
          </div>
        </div>

        {/* Current Theme Info */}
        <div style={{
          backgroundColor: 'var(--color-background-card)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-xl)',
          border: '1px solid var(--color-border-primary)',
          boxShadow: 'var(--color-shadow-md)',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: 'var(--font-fontSize-xl)',
            fontWeight: 'var(--font-fontWeight-semibold)',
            marginBottom: 'var(--spacing-lg)',
            color: 'var(--color-text-primary)'
          }}>
            Current Theme: {currentTheme.name}
          </h3>
          <p style={{
            fontSize: 'var(--font-fontSize-base)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Available themes: {availableThemes.join(', ')}
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-md)',
            flexWrap: 'wrap'
          }}>
            {availableThemes.map(themeName => (
              <div
                key={themeName}
                style={{
                  backgroundColor: currentTheme.name === themeName ? 'var(--color-primary)' : 'var(--color-background-secondary)',
                  color: currentTheme.name === themeName ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-fontSize-sm)',
                  fontWeight: 'var(--font-fontWeight-medium)',
                  border: '1px solid var(--color-border-primary)'
                }}
              >
                {themeName}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

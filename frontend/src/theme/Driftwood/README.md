# Driftwood Theme

A serene, coastal-inspired theme with soft blue-grey tones that evoke the peaceful feeling of driftwood washed ashore.

## Color Palette

The Driftwood theme is based on a carefully selected palette of blue-grey tones:

- **Primary**: `#bcd4de` - Light blue-gray (main brand color)
- **Secondary**: `#a0b9bf` - Medium blue-gray (supporting color)
- **Accent**: `#949ba0` - Dark gray (emphasis color)
- **Background**: `#ffffff` - Pure white
- **Surface**: `#f8fafb` - Light gray

## Design Philosophy

The Driftwood theme emphasizes:
- **Serenity**: Soft, calming colors that reduce visual stress
- **Clarity**: High contrast text on clean backgrounds
- **Cohesion**: Harmonious color relationships throughout the interface
- **Accessibility**: WCAG-compliant color combinations

## Usage

The theme can be applied through the theme switcher in the application header, or programmatically:

```typescript
import { ThemeManager } from '../theme/ThemeManager';

const themeManager = new ThemeManager();
themeManager.setTheme('driftwood');
```

## Color Applications

- **Primary buttons**: Use the primary blue-gray for main actions
- **Secondary buttons**: Use the medium blue-gray for supporting actions
- **Accent elements**: Use the dark gray for emphasis and highlights
- **Text**: Dark gray on light backgrounds for optimal readability
- **Borders**: Subtle gray borders for definition without harshness

## Accessibility

All color combinations in this theme meet WCAG 2.1 AA standards for contrast ratios, ensuring the interface is accessible to users with visual impairments.

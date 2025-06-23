# Styles Directory

This directory contains global styles, CSS utilities, and styling configurations for the WaxRadio application.

## 📁 Structure

```
styles/
├── globals.css          # Global CSS styles (moved to app/)
├── components.css       # Component-specific styles
├── utilities.css        # Custom utility classes
└── themes/              # Theme-specific styles
```

## 🎨 Styling Architecture

### Tailwind CSS
The application uses Tailwind CSS as the primary styling framework:
- Utility-first approach
- Responsive design utilities
- Dark mode support
- Custom design tokens

### CSS Custom Properties
Global CSS variables for consistent theming:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}
```

### Component Styling
- Use Tailwind classes for component styling
- Create custom components for complex patterns
- Follow design system guidelines
- Ensure accessibility compliance

## 🎯 Usage Guidelines

### Class Naming
- Use Tailwind utility classes
- Create custom classes when needed
- Follow BEM methodology for custom CSS
- Use semantic class names

### Responsive Design
- Mobile-first approach
- Use Tailwind breakpoints
- Test on multiple devices
- Ensure touch-friendly interfaces

### Dark Mode
- Use CSS custom properties
- Test both light and dark themes
- Ensure proper contrast ratios
- Support system preferences

## 🔧 Development

### Adding New Styles
1. Use Tailwind utilities when possible
2. Create custom CSS for complex patterns
3. Follow the design system
4. Test across browsers and devices

### Custom Components
- Create reusable component styles
- Document usage and variants
- Ensure accessibility
- Test with different content

### Performance
- Minimize custom CSS
- Use CSS-in-JS sparingly
- Optimize for critical rendering path
- Consider CSS bundle size

## 📱 Responsive Breakpoints

### Tailwind Defaults
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

### Custom Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px and up

## 🎨 Design System

### Colors
- Primary colors for branding
- Secondary colors for accents
- Semantic colors for feedback
- Neutral colors for text and backgrounds

### Typography
- Inter font family
- Consistent font sizes
- Proper line heights
- Responsive scaling

### Spacing
- Consistent spacing scale
- Responsive margins and padding
- Component spacing guidelines

### Shadows
- Subtle elevation system
- Consistent shadow values
- Dark mode support

## 🔍 Best Practices

### Accessibility
- Ensure proper contrast ratios
- Support keyboard navigation
- Provide focus indicators
- Test with screen readers

### Performance
- Use efficient selectors
- Minimize CSS bundle size
- Optimize critical CSS
- Use CSS containment

### Maintainability
- Follow consistent patterns
- Document custom styles
- Use meaningful class names
- Keep styles modular 
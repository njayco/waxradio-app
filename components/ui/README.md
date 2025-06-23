# UI Components

This directory contains base UI components built with shadcn/ui and Radix UI primitives. These components provide the foundation for all other components in the application.

## 📁 Component Overview

### Form Components
- `button.tsx` - Button variants and states
- `input.tsx` - Form input fields
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Form labels
- `checkbox.tsx` - Checkbox inputs
- `radio-group.tsx` - Radio button groups
- `select.tsx` - Dropdown select
- `switch.tsx` - Toggle switches
- `slider.tsx` - Range sliders
- `form.tsx` - Form wrapper with validation

### Layout Components
- `card.tsx` - Content containers
- `separator.tsx` - Visual dividers
- `aspect-ratio.tsx` - Aspect ratio containers
- `scroll-area.tsx` - Custom scrollable areas
- `resizable.tsx` - Resizable panels

### Navigation Components
- `navigation-menu.tsx` - Navigation menus
- `breadcrumb.tsx` - Breadcrumb navigation
- `pagination.tsx` - Page navigation
- `tabs.tsx` - Tab interfaces
- `sidebar.tsx` - Sidebar navigation

### Overlay Components
- `dialog.tsx` - Modal dialogs
- `sheet.tsx` - Slide-out panels
- `popover.tsx` - Floating content
- `tooltip.tsx` - Hover tooltips
- `hover-card.tsx` - Hover cards
- `alert-dialog.tsx` - Confirmation dialogs

### Data Display Components
- `table.tsx` - Data tables
- `badge.tsx` - Status badges
- `avatar.tsx` - User avatars
- `progress.tsx` - Progress indicators
- `skeleton.tsx` - Loading placeholders
- `calendar.tsx` - Date picker

### Feedback Components
- `toast.tsx` - Toast notifications
- `toaster.tsx` - Toast container
- `alert.tsx` - Alert messages
- `sonner.tsx` - Toast provider

### Interactive Components
- `dropdown-menu.tsx` - Dropdown menus
- `context-menu.tsx` - Right-click menus
- `menubar.tsx` - Menu bars
- `command.tsx` - Command palette
- `accordion.tsx` - Collapsible content
- `collapsible.tsx` - Collapsible sections
- `toggle.tsx` - Toggle buttons
- `toggle-group.tsx` - Toggle button groups

### Media Components
- `carousel.tsx` - Image carousels
- `chart.tsx` - Data visualizations

## 🎨 Design System

### Color Palette
The components use CSS custom properties for consistent theming:
- Primary colors
- Secondary colors
- Accent colors
- Neutral colors
- Semantic colors (success, warning, error)

### Typography
- Inter font family
- Consistent font sizes
- Proper line heights
- Responsive scaling

### Spacing
- Consistent spacing scale
- Responsive margins and padding
- Proper component spacing

### Shadows
- Subtle elevation system
- Consistent shadow values
- Dark mode support

## 🔧 Usage Guidelines

### Importing Components
```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
```

### Component Variants
Most components support multiple variants:
```tsx
// Button variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Button sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Accessibility
All components include:
- Proper ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast support

### Responsive Design
Components are designed to work across:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🎯 Customization

### Theme Customization
Modify the theme in `tailwind.config.ts`:
```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
      fontFamily: {
        // Custom fonts
      },
    },
  },
}
```

### Component Customization
Create custom variants by extending the base components:
```tsx
// Custom button variant
const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn("custom-styles", className)}
        {...props}
      />
    );
  }
);
```

## 🔄 State Management

### Form State
Use React Hook Form for form management:
```tsx
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

const form = useForm();
<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```

### Toast Notifications
Use the toast hook for notifications:
```tsx
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success",
  description: "Operation completed successfully",
});
```

## 🧪 Testing

### Component Testing
Test components with React Testing Library:
```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

test("renders button with correct text", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole("button")).toHaveTextContent("Click me");
});
```

### Accessibility Testing
Use jest-axe for accessibility testing:
```tsx
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

test("button has no accessibility violations", async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Hook Form Documentation](https://react-hook-form.com/) 
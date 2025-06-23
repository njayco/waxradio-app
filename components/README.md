# Components Directory

This directory contains all reusable React components for the WaxRadio application, organized by feature and functionality.

## 📁 Structure

```
components/
├── ui/                     # Base UI components (shadcn/ui)
├── auth/                   # Authentication components
├── dashboard/              # Dashboard-specific components
├── music/                  # Music player and track components
├── playlist/               # Playlist management components
├── profile/                # User profile components
├── upload/                 # File upload components
├── onboarding-tutorial.tsx # User onboarding tutorial
└── theme-provider.tsx      # Theme context provider
```

## 🎨 UI Components (`ui/`)

Base UI components built with shadcn/ui and Radix UI primitives. These provide the foundation for all other components.

**Key Components:**
- `button.tsx` - Button variants and states
- `input.tsx` - Form input fields
- `dialog.tsx` - Modal dialogs
- `dropdown-menu.tsx` - Dropdown menus
- `avatar.tsx` - User avatars
- `card.tsx` - Content containers
- `toast.tsx` - Notification toasts

## 🔐 Authentication Components (`auth/`)

Components for user authentication and authorization.

**Features:**
- Login/signup forms
- Password reset
- Email verification
- Social authentication
- Protected route wrappers

## 📊 Dashboard Components (`dashboard/`)

Main dashboard interface components.

**Features:**
- Navigation sidebar
- Statistics cards
- Activity feeds
- Quick actions
- User overview

## 🎵 Music Components (`music/`)

Music playback and track management components.

**Features:**
- Audio player controls
- Track information display
- Playlist integration
- Volume controls
- Progress indicators

## 📋 Playlist Components (`playlist/`)

Playlist creation and management components.

**Features:**
- Playlist creation forms
- Track selection
- Playlist editing
- Sharing functionality
- Collaborative features

## 👤 Profile Components (`profile/`)

User profile and settings components.

**Features:**
- Profile editing forms
- Avatar upload
- Bio management
- Privacy settings
- Account preferences

## 📤 Upload Components (`upload/`)

File upload and management components.

**Features:**
- Drag-and-drop file upload
- Progress indicators
- File validation
- Audio file processing
- Image optimization

## 🎓 Onboarding Tutorial

`onboarding-tutorial.tsx` - Interactive tutorial for new users.

**Features:**
- Step-by-step guidance
- Feature highlights
- Interactive elements
- Progress tracking
- Skip functionality

## 🌓 Theme Provider

`theme-provider.tsx` - Theme context and provider.

**Features:**
- Dark/light mode switching
- Theme persistence
- CSS variable management
- System theme detection

## 🎯 Component Guidelines

### Naming Convention
- Use PascalCase for component names
- Use kebab-case for file names
- Include `.tsx` extension for TypeScript components

### Props Interface
- Define TypeScript interfaces for all props
- Use descriptive prop names
- Include JSDoc comments for complex props

### Styling
- Use Tailwind CSS classes
- Follow design system tokens
- Ensure responsive design
- Support dark mode

### Accessibility
- Include ARIA labels
- Support keyboard navigation
- Provide focus indicators
- Use semantic HTML

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimize re-renders
- Lazy load when appropriate

## 🔧 Development

### Adding New Components

1. Create component file in appropriate directory
2. Define TypeScript interface for props
3. Add JSDoc comments
4. Implement component logic
5. Add to component index if needed
6. Update this README

### Testing

- Write unit tests for complex logic
- Test accessibility features
- Verify responsive behavior
- Check theme compatibility

### Documentation

- Include usage examples
- Document prop interfaces
- Explain component behavior
- Provide accessibility notes 
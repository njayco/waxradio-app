# App Directory

This directory contains the Next.js 14 App Router pages and layouts for the WaxRadio application.

## 📁 Structure

```
app/
├── layout.tsx              # Root layout component
├── page.tsx                # Home page component
├── loading.tsx             # Loading component for Suspense boundaries
├── globals.css             # Global styles and CSS variables
└── create-profile/         # Create profile page route
```

## 🔧 Files

### `layout.tsx`
- **Purpose**: Root layout that wraps all pages
- **Features**: 
  - Theme provider setup
  - Authentication context
  - Global toast notifications
  - Font configuration (Inter)
  - Meta tags and SEO

### `page.tsx`
- **Purpose**: Main home page component
- **Features**:
  - User authentication state handling
  - Music player integration
  - Dashboard layout
  - Responsive design
  - Onboarding tutorial integration

### `loading.tsx`
- **Purpose**: Loading component for Suspense boundaries
- **Usage**: Automatically used by Next.js for loading states

### `globals.css`
- **Purpose**: Global CSS styles and Tailwind CSS configuration
- **Features**:
  - CSS variables for theming
  - Base styles and resets
  - Custom utility classes
  - Dark mode support

### `create-profile/`
- **Purpose**: Route for user profile creation
- **Features**: Profile setup form and validation

## 🎨 Styling

The app uses Tailwind CSS with custom CSS variables for theming. The global styles include:
- CSS custom properties for colors
- Base typography styles
- Utility classes for common patterns
- Dark mode support

## 🔐 Authentication

The layout includes authentication context that provides:
- User state management
- Login/logout functionality
- Protected route handling
- User profile data

## 🎵 Music Player

The main page integrates a music player that:
- Handles audio playback
- Manages playlists
- Provides volume control
- Shows track information

## 📱 Responsive Design

All components are designed to work on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔄 State Management

The app uses React Context for:
- User authentication state
- Theme preferences
- Music player state
- Onboarding progress

## 🎯 User Journey & State Flow

### State Flow Order
1. **LoadingState** - Initial app loading with timeout fallback
2. **ErrorState** - Display errors with retry functionality
3. **AuthenticationState** - Login/signup forms for unauthenticated users
4. **ProfileSetupState** - Profile setup for both artists and fans
5. **OnboardingState** - Tutorial for first-time users
6. **DashboardState** - Main application interface

### User Experience Flow
- **New Users**: Complete full onboarding flow
- **Returning Users**: Skip to dashboard if authenticated
- **Profile Updates**: Accessible from settings
- **Onboarding Reset**: Available in user preferences 
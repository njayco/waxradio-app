# Hooks Directory

This directory contains custom React hooks that provide reusable logic and state management for the WaxRadio application.

## 📁 Structure

```
hooks/
├── useAuth.tsx             # Authentication state management
├── useAudioPlayer.ts       # Audio playback controls
├── useMusic.ts             # Music data and playlist management
├── useOnboarding.ts        # User onboarding state
├── use-mobile.tsx          # Mobile device detection
└── use-toast.ts            # Toast notification management
```

## 🔐 Authentication Hook

### `useAuth.tsx`

**Purpose**: Manages user authentication state and Firebase Auth integration.

**Features**:
- User login/logout functionality
- Authentication state persistence
- User profile data management
- Protected route handling
- Social authentication support

**Key Functions**:
- `signIn()` - User sign in
- `signUp()` - User registration
- `signOut()` - User logout
- `updateProfile()` - Update user profile
- `resetPassword()` - Password reset

**Usage**:
```tsx
const { user, signIn, signOut, loading } = useAuth();
```

## 🎵 Audio Player Hook

### `useAudioPlayer.ts`

**Purpose**: Manages audio playback state and controls.

**Features**:
- Play/pause functionality
- Volume control
- Progress tracking
- Playlist management
- Audio visualization

**Key Functions**:
- `play()` - Start playback
- `pause()` - Pause playback
- `setVolume()` - Adjust volume
- `seekTo()` - Jump to position
- `loadTrack()` - Load new track

**Usage**:
```tsx
const { 
  isPlaying, 
  currentTrack, 
  volume, 
  play, 
  pause, 
  setVolume 
} = useAudioPlayer();
```

## 🎶 Music Management Hook

### `useMusic.ts`

**Purpose**: Handles music data, playlists, and track management.

**Features**:
- Track CRUD operations
- Playlist management
- Search and filtering
- Favorites system
- Recent plays tracking

**Key Functions**:
- `getTracks()` - Fetch tracks
- `createPlaylist()` - Create new playlist
- `addToPlaylist()` - Add track to playlist
- `searchTracks()` - Search functionality
- `toggleFavorite()` - Favorite/unfavorite

**Usage**:
```tsx
const { 
  tracks, 
  playlists, 
  createPlaylist, 
  searchTracks 
} = useMusic();
```

## 🎓 Onboarding Hook

### `useOnboarding.ts`

**Purpose**: Manages user onboarding flow and progress.

**Features**:
- Step-by-step tutorial
- Progress tracking
- Completion status
- Skip functionality
- Persistent state

**Key Functions**:
- `nextStep()` - Advance to next step
- `previousStep()` - Go to previous step
- `completeOnboarding()` - Mark as complete
- `skipOnboarding()` - Skip tutorial
- `getProgress()` - Get completion percentage

**Usage**:
```tsx
const { 
  currentStep, 
  isComplete, 
  nextStep, 
  skipOnboarding 
} = useOnboarding();
```

## 📱 Mobile Detection Hook

### `use-mobile.tsx`

**Purpose**: Detects mobile devices and provides responsive utilities.

**Features**:
- Device type detection
- Screen size utilities
- Touch capability detection
- Orientation handling

**Key Functions**:
- `isMobile()` - Check if mobile device
- `isTablet()` - Check if tablet device
- `isTouch()` - Check touch capability
- `getScreenSize()` - Get current screen size

**Usage**:
```tsx
const { isMobile, isTablet, isTouch } = useMobile();
```

## 🔔 Toast Notification Hook

### `use-toast.ts`

**Purpose**: Manages toast notifications and alerts.

**Features**:
- Multiple notification types
- Auto-dismiss functionality
- Custom durations
- Queue management
- Position control

**Key Functions**:
- `toast()` - Show notification
- `success()` - Success message
- `error()` - Error message
- `warning()` - Warning message
- `dismiss()` - Dismiss notification

**Usage**:
```tsx
const { toast, success, error, warning } = useToast();
```

## 🎯 Hook Guidelines

### Naming Convention
- Use `use` prefix for all hooks
- Use camelCase for hook names
- Use descriptive names that indicate purpose

### State Management
- Use `useState` for local state
- Use `useReducer` for complex state
- Use `useContext` for global state
- Use `useEffect` for side effects

### Performance
- Use `useCallback` for function memoization
- Use `useMemo` for expensive calculations
- Use `useRef` for mutable values
- Avoid unnecessary re-renders

### Error Handling
- Include error states in hooks
- Provide error recovery mechanisms
- Log errors appropriately
- Return meaningful error messages

### TypeScript
- Define proper types for all parameters
- Use generic types where appropriate
- Include JSDoc comments
- Export types when needed

## 🔧 Development

### Creating New Hooks

1. Create hook file with `use` prefix
2. Define TypeScript interfaces
3. Implement hook logic
4. Add error handling
5. Include JSDoc documentation
6. Test with different scenarios

### Testing Hooks

- Test with React Testing Library
- Verify state changes
- Test error scenarios
- Check cleanup functions
- Test with different inputs

### Documentation

- Include usage examples
- Document all parameters
- Explain return values
- Provide error handling notes
- Include performance considerations 
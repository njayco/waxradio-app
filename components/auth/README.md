# Authentication Components

This directory contains authentication-related components for user login, signup, and account management.

## 📁 Components

### LoginForm
- **Purpose**: User login with email and password
- **Features**: Form validation, error handling, loading states
- **Props**: `onSwitchToSignUp` callback

### SignUpForm
- **Purpose**: User registration with email, password, and user type
- **Features**: Form validation, user type selection, terms acceptance
- **Props**: `onSwitchToLogin` callback

### PasswordReset
- **Purpose**: Password reset functionality
- **Features**: Email validation, reset link sending
- **Props**: `onBackToLogin` callback

### EmailVerification
- **Purpose**: Email verification for new accounts
- **Features**: Resend verification, status display
- **Props**: `email`, `onVerified` callback

## 🔐 Authentication Flow

### 1. Login Process
1. User enters email and password
2. Form validation checks input
3. Firebase authentication attempt
4. Success: Redirect to dashboard
5. Error: Display error message

### 2. Signup Process
1. User fills registration form
2. Selects user type (artist/fan)
3. Accepts terms and conditions
4. Firebase account creation
5. Email verification sent
6. Profile setup (if artist)

### 3. Password Reset
1. User requests password reset
2. Email validation
3. Reset link sent to email
4. User clicks link and sets new password

## 🎨 UI/UX Guidelines

### Form Design
- Clean, minimal interface
- Clear error messages
- Loading indicators
- Responsive design
- Accessibility compliance

### Validation
- Real-time input validation
- Clear error messages
- Success feedback
- Form completion indicators

### Security
- Secure password requirements
- Rate limiting
- CSRF protection
- Input sanitization

## 🔧 Development

### Adding New Components
1. Create component file
2. Define TypeScript interfaces
3. Implement form validation
4. Add error handling
5. Test with different scenarios

### Testing
- Unit tests for validation logic
- Integration tests for auth flow
- Accessibility testing
- Cross-browser testing

### Styling
- Use Tailwind CSS classes
- Follow design system
- Ensure responsive design
- Support dark mode 
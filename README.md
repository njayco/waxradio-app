# WaxRadio App

A modern music streaming and social platform built with Next.js, Firebase, and TypeScript.

## 🎵 Features

- **Music Streaming**: Upload, play, and share music tracks
- **User Profiles**: Create and customize user profiles
- **Playlists**: Create and manage music playlists
- **Social Features**: Follow other users and discover new music
- **Real-time Updates**: Live notifications and updates
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Project Structure

```
waxradio-app/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable React components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   ├── music/             # Music player and track components
│   ├── playlist/          # Playlist management components
│   ├── profile/           # User profile components
│   └── upload/            # File upload components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
├── public/                # Static assets
├── styles/                # Global styles and CSS
└── nginx/                 # Nginx configuration for deployment
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd waxradio-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State Management**: React hooks and context
- **Audio**: Web Audio API

## 📁 Directory Documentation

Each directory contains its own README file with detailed information about its purpose and contents.

## 🔥 Firebase Setup

This app uses Firebase for:
- **Authentication**: User sign-up/sign-in
- **Firestore**: Database for user data, playlists, tracks
- **Storage**: File storage for audio files and images

See `lib/firebase.ts` for configuration details.

## 🎨 UI Components

The app uses shadcn/ui components located in `components/ui/`. These are customizable, accessible components built on top of Radix UI primitives.

## 📱 Mobile Support

The app is fully responsive and includes mobile-specific optimizations. See `hooks/use-mobile.tsx` for mobile detection utilities.

## 🚀 Deployment

The app can be deployed to various platforms:
- Vercel (recommended for Next.js)
- Netlify
- Firebase Hosting
- Custom server with nginx configuration

See `nginx/` directory for server configuration examples.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔄 Application State Flow

The WaxRadio application follows a specific state flow to ensure a smooth user experience:

### State Flow Order
1. **LoadingState** - Initial app loading with timeout fallback
2. **ErrorState** - Display errors with retry functionality  
3. **AuthenticationState** - Login/signup forms for unauthenticated users
4. **ProfileSetupState** - Profile setup for both artists and fans
5. **OnboardingState** - Tutorial for first-time users
6. **DashboardState** - Main application interface

### User Journey
- **New Users**: Complete the full flow from authentication to dashboard
- **Returning Users**: Skip to dashboard if already authenticated and profile is complete
- **Profile Updates**: Can access profile setup from settings
- **Onboarding**: Can be reset from settings for tutorial access 
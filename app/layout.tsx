/**
 * Root Layout Component
 * 
 * This is the main layout component that wraps all pages in the WaxRadio application.
 * It provides the foundational structure including theme management, authentication,
 * and global styling.
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/hooks/useAuth'
import { Toaster } from '@/components/ui/sonner'

// Configure Inter font with Latin subset for optimal performance
const inter = Inter({ subsets: ['latin'] })

// SEO metadata for the application
export const metadata: Metadata = {
  title: 'Wax Radio - Music Discovery',
  description: 'Discover and share music with the Wax Radio community',
}

/**
 * RootLayout Component
 * 
 * Provides the root layout structure for all pages in the application.
 * This component sets up:
 * - Theme management (dark/light mode)
 * - Authentication context
 * - Global toast notifications
 * - Font configuration
 * - Basic page structure
 * 
 * @param children - React components to be rendered within the layout
 * @returns JSX element with the complete layout structure
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Theme Provider: Manages dark/light mode switching */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Auth Provider: Manages user authentication state */}
          <AuthProvider>
            {/* Main content container with minimum height and background */}
            <div className="min-h-screen bg-background">
              {children}
            </div>
            {/* Global toast notification system */}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

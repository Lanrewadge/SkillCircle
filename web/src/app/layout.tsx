import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
})

export const metadata: Metadata = {
  title: 'SkillCircle - Learn & Teach Skills Locally',
  description: 'Connect with local experts to learn new skills or share your expertise with others.',
  keywords: ['skills', 'learning', 'teaching', 'local', 'community', 'education'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SkillCircle',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://skillcircle.app',
    siteName: 'SkillCircle',
    title: 'SkillCircle - Learn & Teach Skills Locally',
    description: 'Connect with local experts to learn new skills or share your expertise with others.',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'SkillCircle Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillCircle - Learn & Teach Skills Locally',
    description: 'Connect with local experts to learn new skills or share your expertise with others.',
    images: ['/icons/icon-512x512.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#3B82F6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="SkillCircle" />
        <meta name="apple-mobile-web-app-title" content="SkillCircle" />
        <meta name="msapplication-starturl" content="/" />
        <meta name="msapplication-TileColor" content="#3B82F6" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        {/* Favicon */}
        <link rel="icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider defaultTheme="system">
              <ServiceWorkerRegistration />
              {children}
              <PWAInstallPrompt />
              <Toaster position="top-right" />
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import "./globals.css"
import ErrorDialogPortal from '@/components/ErrorDialogPortal';
import { AuthProvider } from '@/hooks/auth-context';
import { ErrorDialogProvider } from '@/hooks/ErrorDialogContext';
import { Sidebar } from 'lucide-react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout-elements/app-sidebar';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Segretaria virtuale',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`font-sans antialiased`}>
        <script
          // remove injected attributes that browser extensions may add before React hydrates
          dangerouslySetInnerHTML={{
            __html: `try{ if(typeof document !== 'undefined' && document.body && document.body.hasAttribute('cz-shortcut-listen')){ document.body.removeAttribute('cz-shortcut-listen'); } }catch(e){}`,
          }}
        />
        <ErrorDialogProvider>
          <AuthProvider>
            {children}

            <ErrorDialogPortal />
            <Analytics />
          </AuthProvider>
        </ErrorDialogProvider>
      </body>
    </html>
  )
}

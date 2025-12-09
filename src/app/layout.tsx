import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import "./globals.css"
import ErrorDialogPortal from '@/components/ErrorDialogPortal';
import { AuthProvider } from '@/hooks/auth-context';
import { ErrorDialogProvider } from '@/hooks/ErrorDialogContext';


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

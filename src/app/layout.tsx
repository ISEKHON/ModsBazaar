import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ModsBazaar - FS22/25 Mods Store',
  description: 'The ultimate destination for Farming Simulator 22/25 mods. Fast, smooth, and gaming-style interface.',
  keywords: 'farming simulator, mods, fs22, fs25, gaming, agriculture',
  authors: [{ name: 'ModsBazaar Team' }],
  openGraph: {
    title: 'ModsBazaar - FS22/25 Mods Store',
    description: 'The ultimate destination for Farming Simulator 22/25 mods',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen gaming-bg">
            {children}
          </div>
          <Toaster 
            position="top-right" 
            theme="dark"
            toastOptions={{
              style: {
                background: '#1a1625',
                border: '1px solid #2d2438',
                color: '#e2e8f0',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}

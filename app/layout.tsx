import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import './layout.module.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'SaúdeDela — Saúde feminina baseada em evidências',
  description: 'Informação confiável para entender seu corpo, conversar melhor com profissionais e cuidar da sua saúde.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f8f5',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    
    <html lang="pt-BR" className="bg-background">
      <body className={`${dmSans.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

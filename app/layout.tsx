import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const mono  = JetBrains_Mono({
  subsets: ['latin'], variable: '--font-jetbrains-mono',
  weight: ['400', '500'], display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'DevBoard', template: '%s — DevBoard' },
  description: 'Tu actividad de GitHub, visualizada. Stats, repos y actividad en un solo panel.',
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* FOUC prevention — apply saved theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('devboard-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',t||(d?'dark':'light'));}catch(e){}})();` }} />
      </head>
      <body className={`${inter.variable} ${mono.variable} bg-background text-text`}>
        {children}
      </body>
    </html>
  )
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signInWithGitHub } from '@/actions/auth'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background dot-grid flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <span className="font-mono font-bold text-lg tracking-tight">
          Dev<span className="text-accent">Board</span>
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={signInWithGitHub}>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm font-sans text-muted hover:text-text border border-border hover:border-border/80 rounded-lg transition-colors"
            >
              <GitHubIcon />
              Sign in
            </button>
          </form>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-sans text-accent bg-accent-dim border border-accent/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Dashboard para desarrolladores
          </span>

          {/* Headline */}
          <h1 className="font-sans font-bold text-5xl sm:text-6xl lg:text-7xl text-text leading-[1.05] tracking-tight mb-6">
            Tu actividad de{' '}
            <span className="text-accent">GitHub</span>,{' '}
            <br className="hidden sm:block" />
            visualizada.
          </h1>

          <p className="text-muted font-sans text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Conecta tu cuenta y obtén insights de tus contribuciones,
            repositorios y pull requests en un solo lugar.
          </p>

          {/* CTA */}
          <form action={signInWithGitHub}>
            <button
              type="submit"
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-text text-background font-sans font-semibold text-sm rounded-xl hover:bg-text/90 transition-colors shadow-glow"
            >
              <GitHubIcon className="w-5 h-5" />
              Continuar con GitHub
            </button>
          </form>

          <p className="mt-4 text-xs text-muted font-sans">
            Solo lectura · Sin escritura en tu cuenta
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full mt-24">
          {[
            {
              icon: <ChartIcon />,
              title: 'Visualizaciones',
              desc: 'Actividad de commits de los últimos 30 días y distribución de lenguajes.',
            },
            {
              icon: <RepoIcon />,
              title: 'Repositorios',
              desc: 'Tus repos con estrellas, forks, lenguaje y último update.',
            },
            {
              icon: <ActivityIcon />,
              title: 'Actividad',
              desc: 'Feed de eventos recientes: pushes, PRs, issues y más.',
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-5 bg-surface border border-border rounded-xl text-left shadow-card"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-dim text-accent mb-3">
                {icon}
              </div>
              <h3 className="font-sans font-semibold text-sm text-text mb-1">{title}</h3>
              <p className="font-sans text-xs text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted font-sans border-t border-border/40">
        DevBoard · Construido con Next.js 16, NextAuth y Recharts
      </footer>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────

function GitHubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function RepoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function ActivityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
    </svg>
  )
}

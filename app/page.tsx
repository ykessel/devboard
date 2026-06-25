import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signInWithGitHub } from '@/actions/auth'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import Link from 'next/link'

// Deterministic bar heights for the commit chart
const BARS = [38,72,55,90,42,65,80,30,58,95,48,70,85,35,62,78,44,88,52,73,40,66,82,50,76,60]

// Heatmap: 7 levels of purple, fixed pattern
const H_LEVELS = ['#1c1c1c','#1c1c1c','rgba(124,58,237,.18)','rgba(124,58,237,.35)','rgba(124,58,237,.55)','rgba(124,58,237,.75)','rgba(124,58,237,.95)']
function heatColor(i: number) {
  const seed = ((i * 1234567) ^ (i << 3)) & 0xffff
  const lvl = seed % 7
  return H_LEVELS[lvl]
}
const HEAT = Array.from({ length: 126 }, (_, i) => heatColor(i))

export default async function LandingPage() {
  const session = await auth()
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-background dot-grid flex flex-col">

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-9 py-5 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <span className="font-mono font-bold text-lg tracking-tight text-text">
          Dev<span className="text-accent">Board</span>
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={signInWithGitHub}>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-text border border-border hover:border-border/80 rounded-lg transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              Sign in
            </button>
          </form>
        </div>
      </nav>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="flex-1 relative px-14 py-18 flex flex-col">

        {/* Purple glow */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '24%', left: '34%',
            transform: 'translate(-50%, -50%)',
            width: 560, height: 560,
            borderRadius: '50%',
            background: 'rgba(124,58,237,.07)',
            filter: 'blur(80px)',
          }}
        />

        {/* ── 2-column hero ──────────────────────────────── */}
        <div className="relative z-10 grid max-w-[1320px] mx-auto w-full gap-14 items-center"
          style={{ gridTemplateColumns: '1.05fr .95fr' }}>

          {/* Left — copy */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs text-accent bg-accent/10 border border-accent/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Dashboard para desarrolladores
            </span>

            <h1 className="font-sans font-bold text-[58px] leading-[1.04] tracking-[-0.03em] text-text mb-5">
              Tu actividad de{' '}
              <span className="text-accent">GitHub</span>,{' '}
              visualizada.
            </h1>

            <p className="text-muted text-lg leading-relaxed mb-8 max-w-[440px]">
              Conecta tu cuenta y obtén insights de tus contribuciones,
              repositorios y pull requests en un solo lugar.
            </p>

            <div className="flex items-center gap-3">
              <form action={signInWithGitHub}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-text text-background font-semibold text-sm rounded-xl hover:opacity-90 transition shadow-glow"
                >
                  <GitHubIcon className="w-5 h-5" />
                  Continuar con GitHub
                </button>
              </form>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-transparent text-muted hover:text-text text-sm font-medium border border-border rounded-xl transition"
              >
                Ver demo
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted">Solo lectura · Sin escritura en tu cuenta</p>
          </div>

          {/* Right — dashboard preview mock */}
          <div
            className="rounded-2xl overflow-hidden border border-border"
            style={{
              background: 'rgb(var(--color-surface))',
              boxShadow: '0 0 40px rgba(124,58,237,.12), 0 20px 50px rgba(0,0,0,.4)',
            }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-[11px] text-muted">devboard.app/dashboard</span>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-3">

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { label: 'Commits', value: '1,284' },
                  { label: 'Repos', value: '37' },
                  { label: 'PRs', value: '92' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 bg-surface-2 border border-border rounded-xl">
                    <div className="text-[11px] text-muted mb-1.5">{label}</div>
                    <div className="font-mono font-bold text-xl text-text">{value}</div>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div className="p-3.5 bg-surface-2 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-text">Commits · 30 días</span>
                  <span className="font-mono text-[11px] text-accent">+18%</span>
                </div>
                <div className="flex items-end gap-[3px] h-16">
                  {BARS.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 min-w-0 rounded-t-[2px]"
                      style={{
                        height: `${h}%`,
                        background: 'linear-gradient(180deg,#7c3aed,rgba(124,58,237,.3))',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Contribution heatmap */}
              <div className="p-3.5 bg-surface-2 border border-border rounded-xl">
                <div className="text-xs font-medium text-text mb-3">Contribuciones</div>
                <div
                  className="grid gap-[3px]"
                  style={{ gridTemplateColumns: 'repeat(18, 1fr)' }}
                >
                  {HEAT.map((c, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-[2px]"
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature cards ──────────────────────────────── */}
        <div className="relative z-10 grid grid-cols-3 gap-4 max-w-[1320px] mx-auto w-full mt-12">
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
            <div key={title} className="p-5 bg-surface border border-border rounded-xl shadow-card">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent mb-3">
                {icon}
              </div>
              <h3 className="font-sans font-semibold text-sm text-text mb-1">{title}</h3>
              <p className="font-sans text-xs text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="text-center py-6 text-xs text-muted border-t border-border/40">
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

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getGitHubToken, getUser, getEvents, buildStats, getRepos } from '@/lib/github'
import { ActivityItem } from '@/components/dashboard/ActivityItem'

export const metadata = { title: 'Actividad' }

export default async function ActivityPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/')

  const token  = await getGitHubToken(session.user.id)
  const ghUser = await getUser(token)
  const [events, repos] = await Promise.all([
    getEvents(ghUser.login, token),
    getRepos(token),
  ])

  const stats = buildStats(events, repos)

  // Group events by date
  const grouped = events.reduce<Record<string, typeof events>>((acc, ev) => {
    const day = ev.created_at.slice(0, 10)
    ;(acc[day] ??= []).push(ev)
    return acc
  }, {})

  const days = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  // Event type breakdown
  const byType = events.reduce<Record<string, number>>((acc, ev) => {
    const label = ev.type.replace('Event', '')
    acc[label] = (acc[label] ?? 0) + 1
    return acc
  }, {})
  const topTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-sans font-bold text-xl text-text">Actividad</h1>
        <p className="text-xs font-sans text-muted mt-0.5">
          {events.length} eventos recientes de @{ghUser.login}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">

        {/* ── Feed ── */}
        <div className="space-y-5 min-w-0">
          {days.map(day => (
            <div key={day}>
              {/* Day header */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-sans font-semibold text-muted uppercase tracking-widest whitespace-nowrap">
                  {formatDay(day)}
                </span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] font-sans text-muted shrink-0">
                  {grouped[day].length} evento{grouped[day].length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Events grid: 2 cols on wide screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {grouped[day].map(ev => (
                  <ActivityItem key={ev.id} event={ev} showDate={false} card />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">

          {/* Quick stats */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h2 className="text-xs font-sans font-semibold text-text mb-3">Resumen 30 días</h2>
            <div className="space-y-3">
              <Stat label="Commits" value={stats.commits} />
              <Stat label="PRs abiertos" value={stats.openPRs} />
              <Stat label="Repos públicos" value={stats.ownRepos} />
              <Stat label="Estrellas totales" value={stats.totalStars} />
            </div>
          </div>

          {/* Event breakdown */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h2 className="text-xs font-sans font-semibold text-text mb-3">Tipos de evento</h2>
            <div className="space-y-2">
              {topTypes.map(([type, count]) => {
                const pct = Math.round((count / events.length) * 100)
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-sans text-muted">{type}</span>
                      <span className="text-[11px] font-sans text-text font-medium">{count}</span>
                    </div>
                    <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Days active */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <h2 className="text-xs font-sans font-semibold text-text mb-1">Días activos</h2>
            <p className="font-sans font-bold text-3xl text-text">{days.length}</p>
            <p className="text-[10px] font-sans text-muted mt-0.5">de los últimos 30 días</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-sans text-muted">{label}</span>
      <span className="text-[11px] font-sans font-semibold text-text">{value}</span>
    </div>
  )
}

function formatDay(iso: string): string {
  const d         = new Date(iso + 'T12:00:00Z')
  const today     = new Date()
  const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)

  if (iso === today.toISOString().slice(0, 10))     return 'Hoy'
  if (iso === yesterday.toISOString().slice(0, 10)) return 'Ayer'

  return d.toLocaleDateString('es', { weekday: 'long', month: 'long', day: 'numeric' })
}

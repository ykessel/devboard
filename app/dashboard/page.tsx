import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import {
  getGitHubToken, getUser, getRepos, getEvents,
  getRepoLanguages, buildCommitActivity, aggregateLanguages, buildStats,
} from '@/lib/github'
import { StatCard } from '@/components/dashboard/StatCard'
import { CommitChart } from '@/components/dashboard/CommitChart'
import { LanguagesChart } from '@/components/dashboard/LanguagesChart'
import { RepoCard } from '@/components/dashboard/RepoCard'
import { ActivityItem } from '@/components/dashboard/ActivityItem'

export const metadata = { title: 'Overview' }

export default async function OverviewPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/')

  const token  = await getGitHubToken(session.user.id)
  const ghUser = await getUser(token)
  const [repos, realEvents] = await Promise.all([
    getRepos(token),
    getEvents(ghUser.login, token),
  ])

  // Language data from top 5 recently-updated repos
  const topRepos = repos.slice(0, 5)
  const langMaps = await Promise.all(topRepos.map(r => getRepoLanguages(r.full_name, token)))

  const stats        = buildStats(realEvents, repos)
  const commitPoints = buildCommitActivity(realEvents)
  const langPoints   = aggregateLanguages(langMaps)
  const recentRepos  = repos.filter(r => !r.fork).slice(0, 4)
  const recentEvents = realEvents.slice(0, 8)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="font-sans font-bold text-xl text-text">Overview</h1>
          <p className="text-xs font-sans text-muted mt-0.5">
            Hola de nuevo, <span className="text-text">{ghUser.name ?? ghUser.login}</span> ·
            últimos 30 días
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Commits" value={stats.commits} icon="commit" />
        <StatCard label="Repos públicos" value={stats.ownRepos} icon="repo" />
        <StatCard label="Total estrellas" value={stats.totalStars} icon="star" />
        <StatCard label="PRs abiertos" value={stats.openPRs} icon="pr" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <h2 className="text-xs font-sans font-semibold text-text mb-4">
            Actividad de commits — 30 días
          </h2>
          <CommitChart data={commitPoints} />
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-xs font-sans font-semibold text-text mb-4">
            Lenguajes principales
          </h2>
          <LanguagesChart data={langPoints} />
        </div>
      </div>

      {/* Repos + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent repos */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-xs font-sans font-semibold text-text mb-3">
            Repositorios recientes
          </h2>
          <div className="space-y-2">
            {recentRepos.map(r => <RepoCard key={r.id} repo={r} compact />)}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-xs font-sans font-semibold text-text mb-3">
            Actividad reciente
          </h2>
          <div className="space-y-0.5">
            {recentEvents.map(ev => <ActivityItem key={ev.id} event={ev} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

import { db } from './db'

// ─── Token helpers ────────────────────────────────────────

export async function getGitHubToken(userId: string): Promise<string> {
  const account = await db.account.findFirst({
    where: { userId, provider: 'github' },
    select: { access_token: true },
  })
  if (!account?.access_token) throw new Error('GitHub token not found')
  return account.access_token
}

async function ghFetch<T>(endpoint: string, token: string): Promise<T> {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${endpoint}`)
  return res.json() as Promise<T>
}

// ─── Types ────────────────────────────────────────────────

export type GHUser = {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  html_url: string
  public_repos: number
  followers: number
  following: number
}

export type GHRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  updated_at: string
  private: boolean
  fork: boolean
}

export type GHEvent = {
  id: string
  type: string
  repo: { name: string }
  payload: {
    action?: string
    ref?: string
    ref_type?: string
    commits?: Array<{ sha: string; message: string }>
    pull_request?: { title: string; number: number; html_url: string; merged?: boolean }
    issue?: { title: string; number: number }
    forkee?: { full_name: string }
  }
  created_at: string
}

// ─── API functions ────────────────────────────────────────

export const getUser = (token: string) =>
  ghFetch<GHUser>('/user', token)

export const getRepos = (token: string) =>
  ghFetch<GHRepo[]>(
    '/user/repos?sort=updated&per_page=50&affiliation=owner&visibility=all',
    token,
  )

export const getEvents = (login: string, token: string) =>
  ghFetch<GHEvent[]>(`/users/${login}/events?per_page=100`, token)

export const getRepoLanguages = (fullName: string, token: string) =>
  ghFetch<Record<string, number>>(`/repos/${fullName}/languages`, token)

// ─── Data processors ─────────────────────────────────────

export type CommitPoint = { date: string; commits: number }

/** Últimos 30 días de actividad de commits a partir de PushEvents */
export function buildCommitActivity(events: GHEvent[]): CommitPoint[] {
  const map = new Map<string, number>()

  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    map.set(d.toISOString().slice(0, 10), 0)
  }

  for (const ev of events) {
    if (ev.type !== 'PushEvent') continue
    const day = ev.created_at.slice(0, 10)
    if (map.has(day)) {
      map.set(day, (map.get(day) ?? 0) + (ev.payload.commits?.length ?? 1))
    }
  }

  return Array.from(map.entries()).map(([date, commits]) => ({
    date: date.slice(5), // MM-DD
    commits,
  }))
}

export type LangPoint = { name: string; value: number }

/** Agrega bytes de lenguajes de múltiples repos y devuelve % top 6 */
export function aggregateLanguages(langMaps: Record<string, number>[]): LangPoint[] {
  const totals = new Map<string, number>()
  for (const map of langMaps) {
    for (const [lang, bytes] of Object.entries(map)) {
      totals.set(lang, (totals.get(lang) ?? 0) + bytes)
    }
  }
  const total = Array.from(totals.values()).reduce((a, b) => a + b, 0)
  if (total === 0) return []

  return Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bytes]) => ({ name, value: Math.round((bytes / total) * 100) }))
}

/** Stats resumen extraídas de eventos + repos */
export function buildStats(events: GHEvent[], repos: GHRepo[]) {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

  const commits = events
    .filter(e => e.type === 'PushEvent' && new Date(e.created_at).getTime() > thirtyDaysAgo)
    .reduce((sum, e) => sum + (e.payload.commits?.length ?? 1), 0)

  const openPRs = events.filter(
    e => e.type === 'PullRequestEvent' && e.payload.action === 'opened',
  ).length

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)
  const ownRepos   = repos.filter(r => !r.fork && !r.private).length

  return { commits, openPRs, totalStars, ownRepos }
}

/** Formatea un evento como texto legible */
export function formatEvent(ev: GHEvent): { label: string; detail: string } {
  const repo = ev.repo.name.split('/')[1] ?? ev.repo.name
  switch (ev.type) {
    case 'PushEvent': {
      const n = ev.payload.commits?.length ?? 1
      return { label: `Pushed ${n} commit${n !== 1 ? 's' : ''}`, detail: repo }
    }
    case 'PullRequestEvent': {
      const action = ev.payload.action === 'closed' && ev.payload.pull_request?.merged
        ? 'Merged'
        : ev.payload.action === 'closed' ? 'Closed' : 'Opened'
      return { label: `${action} PR #${ev.payload.pull_request?.number}`, detail: repo }
    }
    case 'CreateEvent':
      return { label: `Created ${ev.payload.ref_type} ${ev.payload.ref ?? ''}`, detail: repo }
    case 'WatchEvent':
      return { label: 'Starred', detail: ev.repo.name }
    case 'ForkEvent':
      return { label: 'Forked', detail: ev.repo.name }
    case 'IssuesEvent':
      return { label: `${ev.payload.action} issue #${ev.payload.issue?.number}`, detail: repo }
    case 'DeleteEvent':
      return { label: `Deleted ${ev.payload.ref_type}`, detail: repo }
    default:
      return { label: ev.type.replace('Event', ''), detail: repo }
  }
}

import type { GHEvent } from '@/lib/github'
import { formatEvent } from '@/lib/github'

const EVENT_ICONS: Record<string, string> = {
  PushEvent: '↑',
  PullRequestEvent: '⇄',
  CreateEvent: '+',
  DeleteEvent: '−',
  WatchEvent: '★',
  ForkEvent: '⑂',
  IssuesEvent: '○',
  IssueCommentEvent: '◌',
  ReleaseEvent: '◈',
}

export function ActivityItem({
  event, showDate = true, card = false,
}: {
  event: GHEvent
  showDate?: boolean
  card?: boolean
}) {
  const { label, detail } = formatEvent(event)
  const icon    = EVENT_ICONS[event.type] ?? '·'
  const timeAgo = relativeTime(event.created_at)

  if (card) {
    return (
      <div className="flex items-start gap-3 px-3 py-3 bg-surface border border-border rounded-xl hover:border-accent/20 transition-colors">
        <span
          className="mt-0.5 w-6 h-6 shrink-0 flex items-center justify-center rounded-md bg-accent-dim text-accent text-[10px] font-mono font-bold"
          aria-hidden="true"
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-sans text-text truncate">{label}</p>
          <p className="text-[10px] font-sans text-muted truncate">{detail}</p>
        </div>
        <span className="shrink-0 text-[10px] font-sans text-muted whitespace-nowrap">
          {timeAgo}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 px-3 py-2.5 hover:bg-surface-2 transition-colors rounded-lg">
      <span
        className="mt-0.5 w-5 h-5 shrink-0 flex items-center justify-center rounded-md bg-accent-dim text-accent text-[10px] font-mono font-bold"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-sans text-text truncate">{label}</p>
        <p className="text-[10px] font-sans text-muted truncate">{detail}</p>
      </div>
      {showDate && (
        <span className="shrink-0 text-[10px] font-sans text-muted whitespace-nowrap">
          {timeAgo}
        </span>
      )}
    </div>
  )
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60_000)
  const hr   = Math.floor(diff / 3_600_000)
  const day  = Math.floor(diff / 86_400_000)

  if (min < 1)  return 'ahora'
  if (min < 60) return `hace ${min}m`
  if (hr  < 24) return `hace ${hr}h`
  return `hace ${day}d`
}

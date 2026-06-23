import type { GHRepo } from '@/lib/github'

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572a5',
  Rust: '#dea584',
  Go: '#00add8',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Shell: '#89e051',
  Vue: '#41b883',
}

export function RepoCard({ repo, compact }: { repo: GHRepo; compact?: boolean }) {
  const langColor = repo.language ? (LANG_COLORS[repo.language] ?? '#888') : null
  const updatedAt = new Date(repo.updated_at).toLocaleDateString('es', {
    day: 'numeric', month: 'short',
  })

  if (compact) {
    return (
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-3 py-2 group"
      >
        <div className="min-w-0 flex-1">
          <span className="text-xs font-sans font-medium text-text group-hover:text-accent transition-colors truncate block">
            {repo.name}
          </span>
          {repo.description && (
            <span className="text-[10px] font-sans text-muted truncate block mt-0.5">
              {repo.description}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {repo.language && (
            <span className="flex items-center gap-1 text-[10px] font-sans text-muted">
              <span className="w-2 h-2 rounded-full" style={{ background: langColor ?? '#888' }} />
              {repo.language}
            </span>
          )}
          <span className="text-[10px] font-sans text-muted">⭐ {repo.stargazers_count}</span>
        </div>
      </a>
    )
  }

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 bg-surface border border-border rounded-xl hover:border-accent/30 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-sans font-medium text-sm text-text group-hover:text-accent transition-colors truncate">
          {repo.name}
        </span>
        {repo.private && (
          <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-sans text-muted border border-border rounded">
            private
          </span>
        )}
      </div>

      {repo.description && (
        <p className="text-[11px] font-sans text-muted leading-relaxed mb-3 line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {repo.language && (
          <span className="flex items-center gap-1.5 text-[11px] font-sans text-muted">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: langColor ?? '#888' }} />
            {repo.language}
          </span>
        )}
        <span className="text-[11px] font-sans text-muted">⭐ {repo.stargazers_count}</span>
        <span className="text-[11px] font-sans text-muted">🍴 {repo.forks_count}</span>
        {repo.open_issues_count > 0 && (
          <span className="text-[11px] font-sans text-muted">◯ {repo.open_issues_count} issues</span>
        )}
        <span className="text-[11px] font-sans text-muted ml-auto">
          Actualizado {updatedAt}
        </span>
      </div>
    </a>
  )
}

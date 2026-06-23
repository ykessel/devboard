'use client'

import { useState, useEffect, useRef } from 'react'
import type { GHRepo } from '@/lib/github'
import { RepoCard } from './RepoCard'

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const LANGS = ['Todos', 'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'CSS', 'HTML', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Shell', 'Vue', 'Dart']

export function RepoSearch({ repos }: { repos: GHRepo[] }) {
  const [query, setQuery]   = useState('')
  const [lang, setLang]     = useState('Todos')
  const [tab, setTab]       = useState<'own' | 'forks'>('own')
  const inputRef            = useRef<HTMLInputElement>(null)

  // "/" shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const q = normalize(query)

  const filtered = repos.filter(r => {
    const matchTab  = tab === 'own' ? !r.fork : r.fork
    const matchLang = lang === 'Todos' || r.language === lang
    const matchQ    = !q
      || normalize(r.name).includes(q)
      || normalize(r.description ?? '').includes(q)
      || normalize(r.language ?? '').includes(q)
    return matchTab && matchLang && matchQ
  })

  // Only show language pills that exist in the current tab
  const tabRepos   = repos.filter(r => (tab === 'own' ? !r.fork : r.fork))
  const availLangs = ['Todos', ...Array.from(new Set(
    tabRepos.map(r => r.language).filter(Boolean) as string[]
  )).sort()]

  const own   = repos.filter(r => !r.fork)
  const forks = repos.filter(r => r.fork)

  return (
    <div>
      {/* Search + tab bar */}
      <div className="flex items-center gap-3 mb-5">
        {/* Search input */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-3.5 h-3.5" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar repositorios…"
            className="w-full h-9 pl-8 pr-10 text-xs font-sans bg-surface border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <XIcon />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted bg-surface-2 border border-border px-1.5 py-0.5 rounded">
              /
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center h-9 bg-surface border border-border rounded-lg p-1 shrink-0 gap-0.5">
          <TabBtn active={tab === 'own'} onClick={() => { setTab('own'); setLang('Todos') }}>
            Propios <Count n={own.length} />
          </TabBtn>
          <TabBtn active={tab === 'forks'} onClick={() => { setTab('forks'); setLang('Todos') }}>
            Forks <Count n={forks.length} />
          </TabBtn>
        </div>
      </div>

      {/* Language pills */}
      {availLangs.length > 1 && (
        <div className="flex gap-1.5 flex-wrap mb-5">
          {availLangs.map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 text-[10px] font-sans rounded-full border transition-colors ${
                lang === l
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface border-border text-muted hover:text-text hover:border-accent/30'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm font-sans text-muted">
            Sin resultados para{' '}
            <span className="text-text">"{query}"</span>
          </p>
        </div>
      ) : (
        <>
          <p className="text-[10px] font-sans text-muted mb-3">
            {filtered.length} repositorio{filtered.length !== 1 ? 's' : ''}
            {query && ` para "${query}"`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(r => <RepoCard key={r.id} repo={r} />)}
          </div>
        </>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 h-full text-xs font-sans rounded-md transition-colors ${
        active
          ? 'bg-accent/10 text-accent font-medium'
          : 'text-muted hover:text-text'
      }`}
    >
      {children}
    </button>
  )
}

function Count({ n }: { n: number }) {
  return (
    <span className="text-[9px] bg-surface-2 border border-border px-1.5 py-0.5 rounded-full font-sans">
      {n}
    </span>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signOutAction } from '@/actions/auth'
import { SideNav } from '@/components/dashboard/SideNav'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import Image from 'next/image'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/')

  const { name, email, image } = session.user

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-border bg-surface sticky top-0 h-screen">
        {/* Logo + theme toggle */}
        <div className="px-4 py-4 border-b border-border flex items-center justify-between">
          <span className="font-mono font-bold text-base tracking-tight text-text">
            Dev<span className="text-accent">Board</span>
          </span>
          <ThemeToggle />
        </div>

        {/* Client-side nav (needs usePathname) */}
        <SideNav />

        {/* User + sign-out */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            {image && (
              <Image
                src={image}
                alt={name ?? ''}
                width={28}
                height={28}
                className="rounded-full ring-1 ring-border"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-sans font-medium text-text truncate">{name}</p>
              <p className="text-[10px] font-sans text-muted truncate">{email}</p>
            </div>
          </div>
          <form action={signOutAction} className="mt-1">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-sans text-muted hover:text-text hover:bg-surface-2 rounded-md transition-colors"
            >
              <SignOutIcon />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

function SignOutIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}

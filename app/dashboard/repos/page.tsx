import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getGitHubToken, getUser, getRepos } from '@/lib/github'
import { RepoSearch } from '@/components/dashboard/RepoSearch'

export const metadata = { title: 'Repositorios' }

export default async function ReposPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/')

  const token  = await getGitHubToken(session.user.id)
  const ghUser = await getUser(token)
  const repos  = await getRepos(token)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-sans font-bold text-xl text-text">Repositorios</h1>
        <p className="text-xs font-sans text-muted mt-0.5">
          @{ghUser.login} · {repos.filter(r => !r.fork).length} propios ·{' '}
          {repos.filter(r => r.fork).length} forks
        </p>
      </div>

      <RepoSearch repos={repos} />
    </div>
  )
}

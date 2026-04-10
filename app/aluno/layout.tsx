import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlunoHeader } from '@/components/aluno/AlunoHeader'

export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.role === 'admin') redirect('/admin')

  return (
    <div className="min-h-dvh bg-gray-50">
      <AlunoHeader profile={profile} />
      <main className="max-w-2xl mx-auto px-4 pb-16 pt-4">
        {children}
      </main>
    </div>
  )
}

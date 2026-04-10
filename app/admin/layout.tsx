import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/aluno')

  return (
    <div className="min-h-dvh bg-gray-50">
      {/*
        AdminSidebar renders:
        - On desktop (md+): a fixed left sidebar (w-64)
        - On mobile (<md): a fixed top header (h-14)
        Both are out of normal flow (position: fixed).
      */}
      <AdminSidebar profile={profile} />

      {/*
        Main content:
        - md+: offset by sidebar width (ml-64)
        - mobile: offset by top bar height (pt-14)
      */}
      <main className="md:ml-64 pt-14 md:pt-0 min-h-dvh">
        {children}
      </main>
    </div>
  )
}

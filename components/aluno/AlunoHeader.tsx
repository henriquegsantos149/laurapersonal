'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dumbbell, LayoutDashboard, TrendingUp, LogOut } from 'lucide-react'
import { toast } from 'sonner'

const navItems = [
  { href: '/aluno', label: 'Treino', icon: Dumbbell, exact: true },
  { href: '/aluno/progresso', label: 'Evolução', icon: TrendingUp },
]

export function AlunoHeader({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Até logo!')
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">Laura Personal</span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link key={href} href={href}>
                  <div className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                    active ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-600 hover:text-gray-900'
                  )}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div className="flex items-center gap-2">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-medium">
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-red-500" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

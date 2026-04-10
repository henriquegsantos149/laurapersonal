'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dumbbell, TrendingUp, LogOut } from 'lucide-react'
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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-gray-900">Laura Personal</span>
          </div>

          {/* Nav tabs — always visible, icon + label on sm+ */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href)
              return (
                <Link key={href} href={href}>
                  <div
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 min-h-[40px] min-w-[40px] justify-center',
                      active
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User avatar + logout */}
          <div className="flex items-center gap-1.5">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-bold">
                {profile.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9 text-gray-400 hover:text-red-500 hover:bg-red-50"
              onClick={handleLogout}
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

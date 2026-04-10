'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  BookOpen,
  LogOut,
} from 'lucide-react'
import { toast } from 'sonner'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/alunos', label: 'Alunos', icon: Users },
  { href: '/admin/treinos', label: 'Treinos', icon: BookOpen },
  { href: '/admin/exercicios', label: 'Exercícios', icon: Dumbbell },
]

export function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Sessão encerrada')
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-none">Laura Personal</p>
          <p className="text-xs text-muted-foreground mt-0.5">Administrador</p>
        </div>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href}>
              <div className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}>
                <Icon className="w-4 h-4" />
                {label}
              </div>
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* User */}
      <div className="p-4 flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-violet-100 text-violet-700 text-xs font-medium">
            {profile.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{profile.name}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="w-8 h-8 text-gray-400 hover:text-red-500">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </aside>
  )
}

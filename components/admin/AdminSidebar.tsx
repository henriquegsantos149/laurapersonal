'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  BookOpen,
  LogOut,
  Menu,
} from 'lucide-react'
import { toast } from 'sonner'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/alunos', label: 'Alunos', icon: Users },
  { href: '/admin/treinos', label: 'Treinos', icon: BookOpen },
  { href: '/admin/exercicios', label: 'Exercícios', icon: Dumbbell },
]

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex-1 p-4 space-y-1">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link key={href} href={href} onClick={onNavigate}>
            <div
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </div>
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarLogo() {
  return (
    <div className="p-5 flex items-center gap-3">
      <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
        <Dumbbell className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="font-bold text-sm leading-none text-gray-900">Laura Personal</p>
        <p className="text-xs text-gray-400 mt-0.5">Administrador</p>
      </div>
    </div>
  )
}

export function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    toast.success('Sessão encerrada')
    router.push('/login')
    router.refresh()
  }

  function UserFooter() {
    return (
      <>
        <Separator />
        <div className="p-4 flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-bold">
              {profile.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-gray-900">{profile.name}</p>
            <p className="text-xs text-gray-400 truncate">{profile.role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
            aria-label="Sair"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      {/* ─────── Desktop Sidebar ─────── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col shadow-sm h-screen sticky top-0">
        <SidebarLogo />
        <Separator />
        <NavLinks pathname={pathname} />
        <UserFooter />
      </aside>

      {/* ─────── Mobile Top Bar ─────── */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-gray-900">Laura Personal</span>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-orange-100 text-orange-700 text-xs font-bold">
              {profile.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 text-gray-600"
                aria-label="Abrir menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0 flex flex-col">
              <SidebarLogo />
              <Separator />
              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              <UserFooter />
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  )
}

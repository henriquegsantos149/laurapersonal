import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Dumbbell, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalStudents },
    { count: totalPrograms },
    { count: totalExercises },
    { count: totalLogs },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('exercises').select('*', { count: 'exact', head: true }),
    supabase.from('workout_logs').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentStudents } = await supabase
    .from('profiles')
    .select('id, name, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Alunos', value: totalStudents ?? 0, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/alunos' },
    { label: 'Programas', value: totalPrograms ?? 0, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/treinos' },
    { label: 'Exercícios', value: totalExercises ?? 0, icon: Dumbbell, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/exercicios' },
    { label: 'Registros de Treino', value: totalLogs ?? 0, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', href: '#' },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
          <Link key={label} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
                  </div>
                  <div className={`w-9 h-9 sm:w-12 sm:h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alunos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentStudents && recentStudents.length > 0 ? (
              <ul className="space-y-3">
                {recentStudents.map((s) => (
                  <li key={s.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xs font-medium">
                      {s.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum aluno cadastrado ainda
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/alunos/novo">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium">Cadastrar novo aluno</span>
              </div>
            </Link>
            <Link href="/admin/treinos/novo">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer mt-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Criar programa de treino</span>
              </div>
            </Link>
            <Link href="/admin/exercicios/novo">
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer mt-2">
                <Dumbbell className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Adicionar exercício</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

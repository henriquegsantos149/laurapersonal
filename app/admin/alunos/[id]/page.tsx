import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AssignProgramForm } from '@/components/admin/AssignProgramForm'

export default async function AlunoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: aluno }, { data: programs }, { data: assignments }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).eq('role', 'student').single(),
    supabase.from('programs').select('id, name').order('name'),
    supabase.from('assignments').select(`
      id, current_week, active, start_date,
      program:programs(id, name)
    `).eq('student_id', id).order('created_at', { ascending: false }),
  ])

  if (!aluno) notFound()

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/alunos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para alunos
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 text-xl font-bold">
          {aluno.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{aluno.name}</h1>
          <p className="text-muted-foreground text-sm">
            Aluno desde {new Date(aluno.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Atribuir programa */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Atribuir Programa de Treino</CardTitle>
          </CardHeader>
          <CardContent>
            <AssignProgramForm studentId={id} programs={programs ?? []} />
          </CardContent>
        </Card>

        {/* Histórico de programas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico de Programas</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments && assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">{a.program?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Início: {new Date(a.start_date).toLocaleDateString('pt-BR')} · Semana {a.current_week}
                      </p>
                    </div>
                    <Badge variant={a.active ? 'default' : 'secondary'} className={a.active ? 'bg-green-100 text-green-700 border-green-200' : ''}>
                      {a.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum programa atribuído ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

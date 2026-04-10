import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { UserPlus, Users } from 'lucide-react'

export default async function AlunosPage() {
  const supabase = await createClient()

  const { data: alunos } = await supabase
    .from('profiles')
    .select(`
      id, name, created_at,
      assignments (
        id, current_week, active,
        program:programs(name)
      )
    `)
    .eq('role', 'student')
    .order('name')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alunos</h1>
          <p className="text-muted-foreground mt-1">{alunos?.length ?? 0} aluno(s) cadastrado(s)</p>
        </div>
        <Link href="/admin/alunos/novo">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Aluno
          </Button>
        </Link>
      </div>

      {alunos && alunos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {alunos.map((aluno) => {
            const activeAssignment = (aluno.assignments as any[])?.find((a: any) => a.active)
            return (
              <Card key={aluno.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-semibold">
                        {aluno.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{aluno.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Desde {new Date(aluno.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {activeAssignment ? (
                    <div className="bg-violet-50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Programa atual</p>
                      <p className="text-sm font-medium text-violet-800">{activeAssignment.program?.name}</p>
                      <Badge variant="outline" className="mt-1.5 text-xs">
                        Semana {activeAssignment.current_week}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">Sem programa atribuído</p>
                  )}

                  <Link href={`/admin/alunos/${aluno.id}`} className="block mt-3">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Ver detalhes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum aluno cadastrado ainda</p>
          <Link href="/admin/alunos/novo" className="mt-4 inline-block">
            <Button className="bg-violet-600 hover:bg-violet-700 mt-4">
              Cadastrar primeiro aluno
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

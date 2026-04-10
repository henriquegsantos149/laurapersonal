import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { BookOpen, Plus } from 'lucide-react'

export default async function TreinosPage() {
  const supabase = await createClient()

  const { data: programs } = await supabase
    .from('programs')
    .select(`
      id, name, description, created_at,
      days:program_days(count),
      assignments(count)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programas de Treino</h1>
          <p className="text-muted-foreground mt-1">{programs?.length ?? 0} programa(s)</p>
        </div>
        <Link href="/admin/treinos/novo">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Programa
          </Button>
        </Link>
      </div>

      {programs && programs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {programs.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight">{p.name}</h3>
                    {p.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 text-xs text-muted-foreground mb-4">
                  <span>{(p.days as any)?.[0]?.count ?? 0} dias</span>
                  <span>·</span>
                  <span>{(p.assignments as any)?.[0]?.count ?? 0} aluno(s)</span>
                </div>

                <Link href={`/admin/treinos/${p.id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Editar programa
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum programa criado ainda</p>
          <Link href="/admin/treinos/novo" className="mt-4 inline-block">
            <Button className="bg-violet-600 hover:bg-violet-700 mt-4">
              Criar primeiro programa
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

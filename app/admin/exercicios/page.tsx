import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Dumbbell, Plus, Video } from 'lucide-react'

export default async function ExerciciosPage() {
  const supabase = await createClient()

  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .order('name')

  const byMuscle = (exercises ?? []).reduce((acc: Record<string, typeof exercises>, ex: any) => {
    const group = ex.muscle_group ?? 'Geral'
    if (!acc[group]) acc[group] = []
    acc[group]!.push(ex)
    return acc
  }, {})

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Exercícios</h1>
          <p className="text-muted-foreground mt-1">{exercises?.length ?? 0} exercício(s)</p>
        </div>
        <Link href="/admin/exercicios/novo">
          <Button className="bg-violet-600 hover:bg-violet-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Exercício
          </Button>
        </Link>
      </div>

      {exercises && exercises.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(byMuscle).sort(([a], [b]) => a.localeCompare(b)).map(([group, exs]) => (
            <div key={group}>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{group}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {(exs ?? []).map((ex: any) => (
                  <Card key={ex.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{ex.name}</p>
                          {ex.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ex.description}</p>
                          )}
                        </div>
                        {ex.video_url && (
                          <a href={ex.video_url} target="_blank" rel="noopener noreferrer" title="Ver vídeo">
                            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-violet-200">
                              <Video className="w-4 h-4 text-violet-600" />
                            </div>
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum exercício cadastrado ainda</p>
          <Link href="/admin/exercicios/novo" className="mt-4 inline-block">
            <Button className="bg-violet-600 hover:bg-violet-700 mt-4">
              Adicionar primeiro exercício
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

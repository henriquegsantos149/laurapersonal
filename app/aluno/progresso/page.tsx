import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp } from 'lucide-react'
import { ProgressChart } from '@/components/aluno/ProgressChart'

export default async function ProgressoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Buscar todos os logs agrupados por exercício
  const { data: logs } = await supabase
    .from('workout_logs')
    .select(`
      logged_at, set_number, reps, weight_kg,
      part_exercise:part_exercises(
        exercise:exercises(id, name)
      )
    `)
    .eq('student_id', user.id)
    .order('logged_at', { ascending: true })

  if (!logs || logs.length === 0) {
    return (
      <div className="pt-12 text-center">
        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-700">Sem registros ainda</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Registre suas cargas durante os treinos para ver a evolução aqui.
        </p>
      </div>
    )
  }

  // Agrupar logs por exercício
  const byExercise: Record<string, { name: string; data: any[] }> = {}
  for (const log of logs) {
    const ex = (log.part_exercise as any)?.exercise
    if (!ex || !log.weight_kg) continue
    if (!byExercise[ex.id]) {
      byExercise[ex.id] = { name: ex.name, data: [] }
    }
    byExercise[ex.id].data.push({
      date: log.logged_at.split('T')[0],
      weight: log.weight_kg,
      reps: log.reps,
    })
  }

  // Calcular máximos por exercício
  const exerciseStats = Object.entries(byExercise).map(([id, { name, data }]) => {
    const maxWeight = Math.max(...data.map(d => d.weight))
    const firstWeight = data[0]?.weight ?? 0
    const gain = maxWeight - firstWeight
    return { id, name, data, maxWeight, gain }
  }).sort((a, b) => b.maxWeight - a.maxWeight)

  return (
    <div className="pt-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Evolução de Cargas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {exerciseStats.length} exercício(s) com registros
        </p>
      </div>

      {exerciseStats.map(({ id, name, data, maxWeight, gain }) => (
        <Card key={id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-sm font-semibold">{name}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Max: {maxWeight}kg</span>
                {gain > 0 && (
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    +{gain.toFixed(1)}kg
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ProgressChart data={data} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

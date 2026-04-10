import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { WorkoutDayView } from '@/components/aluno/WorkoutDayView'
import { Dumbbell } from 'lucide-react'

const PART_TYPE_LABELS: Record<string, string> = {
  warmup: '🔥 Aquecimento',
  main: '💪 Principal',
  challenge: '🏆 Desafio',
  other: 'Outros',
}

const WEEK_COLORS: Record<number, string> = {
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-red-100 text-red-700',
  4: 'bg-green-100 text-green-700',
}

export default async function AlunoTreinoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: assignment } = await supabase
    .from('assignments')
    .select(`
      id, current_week, start_date,
      program:programs(
        id, name, description,
        days:program_days(
          id, day_number, name, color,
          parts:day_parts(
            id, order_index, name, part_type, notes,
            exercises:part_exercises(
              id, order_index, notes,
              exercise:exercises(id, name, video_url, description)
            )
          )
        ),
        guidelines:weekly_guidelines(week_number, sets, intensity)
      )
    `)
    .eq('student_id', user!.id)
    .eq('active', true)
    .single()

  if (!assignment || !assignment.program) {
    return (
      <div className="pt-12 text-center">
        <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-700">Nenhum programa ativo</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Aguarde sua personal trainer atribuir um programa de treino para você.
        </p>
      </div>
    )
  }

  const program = assignment.program as any
  const currentWeek = assignment.current_week
  const currentGuideline = program.guidelines?.find((g: any) => g.week_number === currentWeek)

  const sortedDays = [...(program.days ?? [])]
    .sort((a: any, b: any) => a.day_number - b.day_number)
    .map((day: any) => ({
      ...day,
      parts: [...(day.parts ?? [])]
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((part: any) => ({
          ...part,
          exercises: [...(part.exercises ?? [])].sort((a: any, b: any) => a.order_index - b.order_index),
        })),
    }))

  return (
    <div className="pt-6 space-y-5">
      {/* Cabeçalho do programa */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">{program.name}</h1>
          {program.description && (
            <p className="text-sm text-muted-foreground mt-0.5">{program.description}</p>
          )}
        </div>
        <Badge className={WEEK_COLORS[currentWeek] ?? ''}>
          Semana {currentWeek}
        </Badge>
      </div>

      {/* Orientação da semana */}
      {currentGuideline && (
        <Card className="border-l-4 border-violet-400">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1">Orientação da semana</p>
            <p className="text-sm font-bold">{currentGuideline.sets}</p>
            <p className="text-sm text-muted-foreground">{currentGuideline.intensity}</p>
          </CardContent>
        </Card>
      )}

      {/* Progresso da semana */}
      <div className="flex items-center gap-3">
        <Progress value={(currentWeek / 4) * 100} className="flex-1 h-2" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{currentWeek}/4 semanas</span>
      </div>

      {/* Dias de treino */}
      {sortedDays.length > 0 ? (
        <Tabs defaultValue={sortedDays[0]?.id}>
          <TabsList className="w-full">
            {sortedDays.map((day: any) => (
              <TabsTrigger key={day.id} value={day.id} className="flex-1 text-xs">
                Dia {day.day_number}
              </TabsTrigger>
            ))}
          </TabsList>
          {sortedDays.map((day: any) => (
            <TabsContent key={day.id} value={day.id}>
              <WorkoutDayView
                day={day}
                assignmentId={assignment.id}
                studentId={user!.id}
                currentWeek={currentWeek}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-8">
          Seu programa ainda não tem dias configurados.
        </p>
      )}
    </div>
  )
}

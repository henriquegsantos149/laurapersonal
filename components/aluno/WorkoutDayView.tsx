'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Video, CheckCircle2, Circle, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react'

const PART_ICONS: Record<string, string> = {
  warmup: '🔥',
  main: '💪',
  challenge: '🏆',
  other: '📌',
}

interface SetLog {
  set_number: number
  reps: string
  weight_kg: string
  saved: boolean
}

interface Props {
  day: any
  assignmentId: string
  studentId: string
  currentWeek: number
}

export function WorkoutDayView({ day, assignmentId, studentId, currentWeek }: Props) {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <h2 className="font-bold text-base">{day.name}</h2>
        <p className="text-xs text-muted-foreground">{day.parts?.length ?? 0} partes · Semana {currentWeek}</p>
      </div>

      {day.parts.map((part: any) => (
        <PartCard
          key={part.id}
          part={part}
          assignmentId={assignmentId}
          studentId={studentId}
        />
      ))}
    </div>
  )
}

function PartCard({ part, assignmentId, studentId }: { part: any; assignmentId: string; studentId: string }) {
  const [expanded, setExpanded] = useState(true)
  const icon = PART_ICONS[part.part_type] ?? '📌'

  return (
    <Card>
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <div>
            <p className="text-sm font-semibold">{part.name}</p>
            {part.notes && <p className="text-xs text-muted-foreground">{part.notes}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{part.exercises?.length ?? 0} exerc.</Badge>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <CardContent className="p-4 pt-0 space-y-4">
          {part.exercises.map((pe: any) => (
            <ExerciseLogger
              key={pe.id}
              partExercise={pe}
              assignmentId={assignmentId}
              studentId={studentId}
            />
          ))}
        </CardContent>
      )}
    </Card>
  )
}

function ExerciseLogger({ partExercise: pe, assignmentId, studentId }: {
  partExercise: any
  assignmentId: string
  studentId: string
}) {
  const supabase = useMemo(() => createClient(), [])
  const today = new Date().toISOString().split('T')[0]

  const [sets, setSets] = useState<SetLog[]>([
    { set_number: 1, reps: '', weight_kg: '', saved: false },
  ])
  const [loadingSet, setLoadingSet] = useState<number | null>(null)
  const [lastLogs, setLastLogs] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      // Carregar logs do dia atual (evita re-salvar séries já salvas)
      const { data: todayLogs } = await supabase
        .from('workout_logs')
        .select('set_number, reps, weight_kg')
        .eq('part_exercise_id', pe.id)
        .eq('student_id', studentId)
        .gte('logged_at', today + 'T00:00:00')
        .lte('logged_at', today + 'T23:59:59')
        .order('set_number')

      if (todayLogs && todayLogs.length > 0) {
        // Pré-popular com os logs já registrados hoje
        setSets(todayLogs.map((l: any) => ({
          set_number: l.set_number,
          reps: String(l.reps ?? ''),
          weight_kg: String(l.weight_kg ?? ''),
          saved: true,
        })))
      }

      // Último treino (sessão anterior) para referência
      const { data: history } = await supabase
        .from('workout_logs')
        .select('set_number, reps, weight_kg, logged_at')
        .eq('part_exercise_id', pe.id)
        .eq('student_id', studentId)
        .lt('logged_at', today + 'T00:00:00')
        .order('logged_at', { ascending: false })
        .limit(5)

      if (history && history.length > 0) setLastLogs(history)
    }
    loadData()
  }, [pe.id, studentId, today])

  async function saveSet(setNum: number) {
    const setData = sets.find(s => s.set_number === setNum)
    if (!setData) return

    setLoadingSet(setNum)

    const { error } = await supabase.from('workout_logs').upsert({
      student_id: studentId,
      part_exercise_id: pe.id,
      assignment_id: assignmentId,
      set_number: setNum,
      reps: setData.reps ? parseInt(setData.reps) : null,
      weight_kg: setData.weight_kg ? parseFloat(setData.weight_kg) : null,
      logged_at: today + 'T12:00:00.000Z',
    }, { onConflict: 'student_id,part_exercise_id,set_number,logged_at' })

    if (error) {
      toast.error('Erro ao salvar série')
    } else {
      setSets(prev => prev.map(s => s.set_number === setNum ? { ...s, saved: true } : s))
      toast.success(`Série ${setNum} registrada!`)
    }
    setLoadingSet(null)
  }

  function addSet() {
    const nextNum = sets.length + 1
    setSets(prev => [...prev, { set_number: nextNum, reps: '', weight_kg: '', saved: false }])
  }

  function removeSet() {
    if (sets.length <= 1) return
    setSets(prev => prev.slice(0, -1))
  }

  function updateSet(setNum: number, field: 'reps' | 'weight_kg', value: string) {
    setSets(prev => prev.map(s => s.set_number === setNum ? { ...s, [field]: value } : s))
  }

  const allSaved = sets.every(s => s.saved)
  const lastSession = lastLogs.length > 0
    ? { reps: lastLogs[0].reps, weight: lastLogs[0].weight_kg }
    : null

  return (
    <div className="border rounded-xl p-3">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{pe.exercise?.name}</p>
            {pe.exercise?.video_url && (
              <a href={pe.exercise.video_url} target="_blank" rel="noopener noreferrer">
                <Video className="w-3.5 h-3.5 text-violet-500 hover:text-violet-700" />
              </a>
            )}
            {allSaved && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          </div>
          {pe.notes && <p className="text-xs text-muted-foreground">{pe.notes}</p>}
          {lastSession && (
            <p className="text-xs text-blue-500 mt-0.5">
              Última vez: {lastSession.reps} reps · {lastSession.weight}kg
            </p>
          )}
        </div>
      </div>

      {/* Séries */}
      <div className="space-y-2">
        <div className="grid grid-cols-[32px_1fr_1fr_64px] gap-2 text-xs text-muted-foreground px-1 mb-1">
          <span>Série</span>
          <span>Reps</span>
          <span>Carga (kg)</span>
          <span></span>
        </div>
        {sets.map((set) => (
          <div key={set.set_number} className={`grid grid-cols-[32px_1fr_1fr_64px] gap-2 items-center rounded-lg px-1 py-1 ${set.saved ? 'bg-green-50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-center">
              {set.saved
                ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                : <Circle className="w-4 h-4 text-gray-300" />
              }
            </div>
            <Input
              type="number"
              placeholder="0"
              value={set.reps}
              onChange={(e) => updateSet(set.set_number, 'reps', e.target.value)}
              disabled={set.saved}
              className="h-8 text-sm text-center"
            />
            <Input
              type="number"
              step="0.5"
              placeholder="0"
              value={set.weight_kg}
              onChange={(e) => updateSet(set.set_number, 'weight_kg', e.target.value)}
              disabled={set.saved}
              className="h-8 text-sm text-center"
            />
            <Button
              size="sm"
              className={`h-8 text-xs w-full ${set.saved ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-violet-600 hover:bg-violet-700'}`}
              onClick={() => saveSet(set.set_number)}
              disabled={set.saved || loadingSet === set.set_number}
            >
              {set.saved ? 'OK' : loadingSet === set.set_number ? '...' : 'Salvar'}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addSet}>
          <Plus className="w-3 h-3" /> Série
        </Button>
        {sets.length > 1 && (
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-red-400 hover:text-red-600" onClick={removeSet}>
            <Minus className="w-3 h-3" /> Remover
          </Button>
        )}
      </div>
    </div>
  )
}

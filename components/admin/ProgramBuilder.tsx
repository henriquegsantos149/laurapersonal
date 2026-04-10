'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProgramWithDays } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Plus, Trash2, Video, ChevronDown, ChevronUp } from 'lucide-react'

const DAY_COLORS = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED']

const PART_TYPES = [
  { value: 'warmup', label: 'Aquecimento' },
  { value: 'main', label: 'Principal' },
  { value: 'challenge', label: 'Desafio' },
  { value: 'other', label: 'Outro' },
]

interface Props {
  program: ProgramWithDays & { guidelines: any[] }
  exercises: { id: string; name: string; muscle_group: string | null }[]
}

export function ProgramBuilder({ program, exercises }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(program.days.map(d => d.id)))

  // --- DIAS ---
  async function addDay() {
    const nextNum = (program.days.length ?? 0) + 1
    const { error } = await supabase.from('program_days').insert({
      program_id: program.id,
      day_number: nextNum,
      name: `DIA ${nextNum}`,
      color: DAY_COLORS[(nextNum - 1) % DAY_COLORS.length],
    })
    if (error) toast.error('Erro ao adicionar dia')
    else { toast.success('Dia adicionado!'); router.refresh() }
  }

  // Salva apenas no blur — evita chamadas a cada keystroke
  async function saveDay(dayId: string, field: string, value: string) {
    const { error } = await supabase.from('program_days').update({ [field]: value }).eq('id', dayId)
    if (!error) router.refresh()
  }

  async function deleteDay(dayId: string) {
    const { error } = await supabase.from('program_days').delete().eq('id', dayId)
    if (error) toast.error('Erro ao remover dia')
    else { toast.success('Dia removido'); router.refresh() }
  }

  // --- PARTES ---
  async function addPart(dayId: string, currentParts: any[]) {
    const nextOrder = currentParts.length + 1
    const { error } = await supabase.from('day_parts').insert({
      day_id: dayId,
      order_index: nextOrder,
      name: `PARTE ${nextOrder}`,
      part_type: 'main',
    })
    if (error) toast.error('Erro ao adicionar parte')
    else { toast.success('Parte adicionada!'); router.refresh() }
  }

  async function savePart(partId: string, field: string, value: string) {
    await supabase.from('day_parts').update({ [field]: value }).eq('id', partId)
    router.refresh()
  }

  async function deletePart(partId: string) {
    await supabase.from('day_parts').delete().eq('id', partId)
    toast.success('Parte removida'); router.refresh()
  }

  // --- EXERCÍCIOS ---
  async function addExerciseToPart(partId: string, exerciseId: string, currentCount: number) {
    if (!exerciseId) return
    const { error } = await supabase.from('part_exercises').insert({
      part_id: partId,
      exercise_id: exerciseId,
      order_index: currentCount + 1,
    })
    if (error) toast.error('Erro ao adicionar exercício')
    else { toast.success('Exercício adicionado!'); router.refresh() }
  }

  async function saveExerciseNotes(peId: string, notes: string) {
    await supabase.from('part_exercises').update({ notes }).eq('id', peId)
    router.refresh()
  }

  async function removeExercise(peId: string) {
    await supabase.from('part_exercises').delete().eq('id', peId)
    toast.success('Exercício removido'); router.refresh()
  }

  // --- ORIENTAÇÕES SEMANAIS ---
  async function saveGuideline(weekNumber: number, sets: string, intensity: string) {
    await supabase.from('weekly_guidelines').upsert({
      program_id: program.id,
      week_number: weekNumber,
      sets,
      intensity,
    }, { onConflict: 'program_id,week_number' })
    toast.success(`Semana ${weekNumber} atualizada`); router.refresh()
  }

  function toggleDay(dayId: string) {
    setExpandedDays(prev => {
      const next = new Set(prev)
      next.has(dayId) ? next.delete(dayId) : next.add(dayId)
      return next
    })
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{program.name}</h1>
          {program.description && <p className="text-muted-foreground mt-1">{program.description}</p>}
        </div>
      </div>

      <Tabs defaultValue="dias">
        <TabsList className="mb-6">
          <TabsTrigger value="dias">Dias de Treino</TabsTrigger>
          <TabsTrigger value="semanas">Orientações Semanais</TabsTrigger>
        </TabsList>

        {/* ABA DIAS */}
        <TabsContent value="dias" className="space-y-4">
          {program.days.map((day) => (
            <Card key={day.id} className="overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                style={{ borderLeft: `4px solid ${day.color}` }}
                onClick={() => toggleDay(day.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: day.color }}>
                    {day.day_number}
                  </div>
                  {/* onBlur salva no banco; defaultValue + key previne re-render resetar o input */}
                  <input
                    key={day.id + day.name}
                    defaultValue={day.name}
                    onBlur={(e) => saveDay(day.id, 'name', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm font-semibold border-0 p-0 h-auto bg-transparent outline-none focus:ring-1 focus:ring-orange-300 rounded px-1 max-w-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-red-400 hover:text-red-600"
                    onClick={(e) => { e.stopPropagation(); deleteDay(day.id) }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  {expandedDays.has(day.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {expandedDays.has(day.id) && (
                <CardContent className="p-4 pt-0 space-y-4">
                  {(day as any).parts.map((part: any) => (
                    <div key={part.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Select value={part.part_type} onValueChange={(v) => savePart(part.id, 'part_type', v ?? 'main')}>
                          <SelectTrigger className="w-36 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PART_TYPES.map(pt => (
                              <SelectItem key={pt.value} value={pt.value} className="text-xs">{pt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input
                          key={part.id + part.name}
                          defaultValue={part.name}
                          onBlur={(e) => savePart(part.id, 'name', e.target.value)}
                          className="flex-1 text-sm font-medium border-0 p-0 h-auto bg-transparent outline-none focus:ring-1 focus:ring-orange-300 rounded px-1"
                          placeholder="Nome da parte..."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 ml-auto text-red-400 hover:text-red-600"
                          onClick={() => deletePart(part.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <input
                        key={part.id + '-notes-' + (part.notes ?? '')}
                        defaultValue={part.notes ?? ''}
                        onBlur={(e) => savePart(part.id, 'notes', e.target.value)}
                        placeholder="Instruções (ex: Realizar 3 Rodadas)..."
                        className="w-full text-xs border rounded px-2 py-1 mb-3 h-8 bg-white outline-none focus:ring-1 focus:ring-orange-300"
                      />

                      {/* Lista de exercícios */}
                      <div className="space-y-2 mb-3">
                        {part.exercises.map((pe: any) => (
                          <div key={pe.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{pe.exercise?.name}</span>
                                {pe.exercise?.video_url && (
                                  <a href={pe.exercise.video_url} target="_blank" rel="noopener noreferrer">
                                    <Video className="w-3.5 h-3.5 text-orange-500" />
                                  </a>
                                )}
                              </div>
                              <input
                                key={pe.id + '-notes-' + (pe.notes ?? '')}
                                defaultValue={pe.notes ?? ''}
                                onBlur={(e) => saveExerciseNotes(pe.id, e.target.value)}
                                placeholder="Observações (ex: com pés paralelos)..."
                                className="w-full mt-1.5 h-7 text-xs border rounded px-2 bg-white outline-none focus:ring-1 focus:ring-orange-300"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6 text-red-400 hover:text-red-600 mt-0.5"
                              onClick={() => removeExercise(pe.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Adicionar exercício */}
                      <AddExerciseSelect
                        exercises={exercises}
                        onAdd={(exerciseId) => addExerciseToPart(part.id, exerciseId, part.exercises.length)}
                      />
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-dashed"
                    onClick={() => addPart(day.id, (day as any).parts)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Adicionar parte
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full border-dashed text-orange-600 hover:text-orange-700 hover:border-orange-300"
            onClick={addDay}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar dia de treino
          </Button>
        </TabsContent>

        {/* ABA SEMANAS */}
        <TabsContent value="semanas">
          <WeeklyGuidelinesEditor
            programId={program.id}
            guidelines={program.guidelines}
            onSave={saveGuideline}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AddExerciseSelect({
  exercises,
  onAdd,
}: {
  exercises: { id: string; name: string; muscle_group: string | null }[]
  onAdd: (id: string) => void
}) {
  const [selected, setSelected] = useState('')

  return (
    <div className="flex gap-2">
      <Select value={selected} onValueChange={(v) => setSelected(v ?? '')}>
        <SelectTrigger className="flex-1 h-8 text-xs">
          <SelectValue placeholder="Adicionar exercício..." />
        </SelectTrigger>
        <SelectContent>
          {exercises.map((e) => (
            <SelectItem key={e.id} value={e.id} className="text-xs">
              {e.name}
              {e.muscle_group && <span className="text-muted-foreground ml-1">· {e.muscle_group}</span>}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        className="h-8 text-xs bg-orange-600 hover:bg-orange-700"
        disabled={!selected}
        onClick={() => { onAdd(selected); setSelected('') }}
      >
        <Plus className="w-3.5 h-3.5" />
      </Button>
    </div>
  )
}

function WeeklyGuidelinesEditor({
  programId,
  guidelines,
  onSave,
}: {
  programId: string
  guidelines: any[]
  onSave: (week: number, sets: string, intensity: string) => void
}) {
  const weeks = [1, 2, 3, 4]
  const [form, setForm] = useState(
    weeks.reduce((acc, w) => {
      const existing = guidelines.find(g => g.week_number === w)
      acc[w] = { sets: existing?.sets ?? '', intensity: existing?.intensity ?? '' }
      return acc
    }, {} as Record<number, { sets: string; intensity: string }>)
  )

  return (
    <div className="space-y-4 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        Configure a progressão de cargas para cada semana do ciclo de 4 semanas.
      </p>
      {weeks.map((w) => (
        <Card key={w}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Semana {w}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Séries x Reps</Label>
                <Input
                  placeholder="Ex: 3 x 12, 4 x 10, 15/12/10/8"
                  value={form[w].sets}
                  onChange={(e) => setForm(f => ({ ...f, [w]: { ...f[w], sets: e.target.value } }))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Intensidade</Label>
                <Input
                  placeholder="Ex: Cargas moderadas"
                  value={form[w].intensity}
                  onChange={(e) => setForm(f => ({ ...f, [w]: { ...f[w], intensity: e.target.value } }))}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <Button
              size="sm"
              className="mt-3 h-7 text-xs bg-orange-600 hover:bg-orange-700"
              onClick={() => onSave(w, form[w].sets, form[w].intensity)}
            >
              Salvar semana {w}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Props {
  studentId: string
  programs: { id: string; name: string }[]
}

export function AssignProgramForm({ studentId, programs }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [programId, setProgramId] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAssign() {
    if (!programId) return
    setLoading(true)

    // Desativar atribuições anteriores
    const { error: deactivateError } = await supabase
      .from('assignments')
      .update({ active: false })
      .eq('student_id', studentId)

    if (deactivateError) {
      toast.error('Erro ao atualizar programa anterior')
      setLoading(false)
      return
    }

    // Criar nova atribuição
    const { error } = await supabase.from('assignments').upsert({
      student_id: studentId,
      program_id: programId,
      start_date: new Date().toISOString().split('T')[0],
      current_week: 1,
      active: true,
    }, { onConflict: 'student_id,program_id' })

    if (error) {
      toast.error('Erro ao atribuir programa')
    } else {
      toast.success('Programa atribuído com sucesso!')
      router.refresh()
    }

    setLoading(false)
    setProgramId('')
  }

  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <Label className="sr-only">Programa</Label>
        <Select value={programId} onValueChange={(v) => setProgramId(v ?? '')}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um programa..." />
          </SelectTrigger>
          <SelectContent>
            {programs.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={handleAssign}
        disabled={!programId || loading}
        className="bg-violet-600 hover:bg-violet-700"
      >
        {loading ? 'Atribuindo...' : 'Atribuir'}
      </Button>
    </div>
  )
}

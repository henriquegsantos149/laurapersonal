import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ProgramBuilder } from '@/components/admin/ProgramBuilder'

export default async function TreinoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: program }, { data: exercises }] = await Promise.all([
    supabase.from('programs').select(`
      id, name, description,
      days:program_days(
        id, day_number, name, color,
        parts:day_parts(
          id, order_index, name, part_type, notes,
          exercises:part_exercises(
            id, order_index, notes,
            exercise:exercises(id, name, video_url, muscle_group)
          )
        )
      ),
      guidelines:weekly_guidelines(id, week_number, sets, intensity)
    `).eq('id', id).single(),
    supabase.from('exercises').select('id, name, muscle_group').order('name'),
  ])

  if (!program) notFound()

  // Ordenar dias e partes
  const sortedProgram = {
    ...program,
    days: (program.days ?? [])
      .sort((a: any, b: any) => a.day_number - b.day_number)
      .map((day: any) => ({
        ...day,
        parts: (day.parts ?? [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((part: any) => ({
            ...part,
            exercises: (part.exercises ?? []).sort((a: any, b: any) => a.order_index - b.order_index),
          })),
      })),
    guidelines: (program.guidelines ?? []).sort((a: any, b: any) => a.week_number - b.week_number),
  }

  return (
    <div className="p-8">
      <Link href="/admin/treinos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para programas
      </Link>
      <ProgramBuilder program={sortedProgram as any} exercises={exercises ?? []} />
    </div>
  )
}

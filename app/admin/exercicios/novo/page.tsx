'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, Dumbbell } from 'lucide-react'
import Link from 'next/link'

const MUSCLE_GROUPS = [
  'Quadríceps', 'Posterior de coxa', 'Glúteos', 'Costas', 'Peito',
  'Ombros', 'Bíceps', 'Tríceps', 'Abdômen', 'Panturrilha', 'Geral', 'Cardio',
]

export default function NovoExercicioPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    video_url: '',
    muscle_group: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('exercises').insert({
      name: form.name,
      description: form.description || null,
      video_url: form.video_url || null,
      muscle_group: form.muscle_group || null,
    })

    if (error) {
      toast.error('Erro ao criar exercício')
      setLoading(false)
      return
    }

    toast.success(`${form.name} adicionado à biblioteca!`)
    router.push('/admin/exercicios')
  }

  return (
    <div className="p-8 max-w-lg">
      <Link href="/admin/exercicios" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para exercícios
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-green-600" />
            Novo Exercício
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome do exercício</Label>
              <Input
                id="name"
                placeholder="Ex: Agachamento Livre, Leg Press..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="muscle_group">Grupo muscular</Label>
              <select
                id="muscle_group"
                value={form.muscle_group}
                onChange={(e) => setForm({ ...form, muscle_group: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Selecionar grupo...</option>
                {MUSCLE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="video_url">Link do vídeo (opcional)</Label>
              <Input
                id="video_url"
                type="url"
                placeholder="https://youtube.com/..."
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">YouTube, Instagram, qualquer URL de vídeo</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição / instruções (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva a execução correta do exercício..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar exercício'}
              </Button>
              <Link href="/admin/exercicios">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

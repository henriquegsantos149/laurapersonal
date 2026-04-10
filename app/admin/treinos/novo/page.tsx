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
import { ArrowLeft, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function NovoProgramaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('programs')
      .insert({ name: form.name, description: form.description || null, created_by: user?.id })
      .select('id')
      .single()

    if (error) {
      toast.error('Erro ao criar programa')
      setLoading(false)
      return
    }

    toast.success('Programa criado! Agora adicione os dias de treino.')
    router.push(`/admin/treinos/${data.id}`)
  }

  return (
    <div className="p-8 max-w-lg">
      <Link href="/admin/treinos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para programas
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Novo Programa de Treino
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome do programa</Label>
              <Input
                id="name"
                placeholder="Ex: HenRe 4.2, Treino Funcional A..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva o foco e objetivos do programa..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700" disabled={loading}>
                {loading ? 'Criando...' : 'Criar e configurar'}
              </Button>
              <Link href="/admin/treinos">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

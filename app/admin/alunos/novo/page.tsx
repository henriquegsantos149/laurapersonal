'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function NovoAlunoPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Criar usuário via Admin API não está disponível no client-side
    // Usamos a rota de API do Next.js
    const res = await fetch('/api/admin/create-student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error ?? 'Erro ao criar aluno')
      setLoading(false)
      return
    }

    toast.success(`Aluno ${form.name} criado com sucesso!`)
    router.push('/admin/alunos')
  }

  return (
    <div className="p-8 max-w-lg">
      <Link href="/admin/alunos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Voltar para alunos
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-orange-600" />
            Novo Aluno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Ex: Henry Rezende"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="aluno@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha inicial</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">O aluno poderá alterar depois</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700" disabled={loading}>
                {loading ? 'Criando...' : 'Criar aluno'}
              </Button>
              <Link href="/admin/alunos">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface DataPoint {
  date: string
  weight: number
  reps: number | null
}

export function ProgressChart({ data }: { data: DataPoint[] }) {
  // Agregar por data — pegar o maior peso de cada sessão
  const byDate = data.reduce((acc: Record<string, DataPoint>, d) => {
    if (!acc[d.date] || d.weight > acc[d.date].weight) {
      acc[d.date] = d
    }
    return acc
  }, {})

  const chartData = Object.values(byDate).map(d => ({
    // Adiciona T12:00 para evitar drift de timezone em Safari/iOS
    date: new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    peso: d.weight,
    reps: d.reps,
  }))

  if (chartData.length < 2) {
    return (
      <div className="h-28 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">Registre mais sessões para ver o gráfico</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={140}>
      <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} unit="kg" />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          formatter={(value) => [`${value}kg`, 'Carga']}
        />
        <Line
          type="monotone"
          dataKey="peso"
          stroke="#7C3AED"
          strokeWidth={2}
          dot={{ fill: '#7C3AED', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

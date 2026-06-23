'use client'

import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import type { LangPoint } from '@/lib/github'

const COLORS = ['#7c3aed', '#a78bfa', '#4f46e5', '#818cf8', '#c4b5fd', '#e0d9ff']

export function LanguagesChart({ data }: { data: LangPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs font-sans text-muted">
        Sin datos de lenguajes
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy={100}
          innerRadius={50}
          outerRadius={74}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            fontSize: '11px',
            fontFamily: 'var(--font-inter)',
            color: '#f0f0f0',
          }}
          itemStyle={{ color: '#f0f0f0' }}
          labelStyle={{ color: '#888' }}
          formatter={(v: number, name: string) => [`${v}%`, name]}
        />

        <Legend
          iconType="circle"
          iconSize={6}
          formatter={(value: string) => (
            <span style={{ fontSize: '10px', color: '#888', fontFamily: 'var(--font-inter)' }}>
              {value}
            </span>
          )}
          wrapperStyle={{ paddingTop: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

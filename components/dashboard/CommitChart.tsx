'use client'

import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { CommitPoint } from '@/lib/github'

export function CommitChart({ data }: { data: CommitPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#252525"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tick={{ fill: '#888', fontSize: 10, fontFamily: 'var(--font-inter)' }}
          tickLine={false}
          axisLine={false}
          interval={6}
        />

        <YAxis
          tick={{ fill: '#888', fontSize: 10, fontFamily: 'var(--font-inter)' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />

        <Tooltip
          contentStyle={{
            background: '#111',
            border: '1px solid #252525',
            borderRadius: '8px',
            fontSize: '11px',
            fontFamily: 'var(--font-inter)',
            color: '#f0f0f0',
          }}
          itemStyle={{ color: '#7c3aed' }}
          formatter={(v: number) => [`${v} commits`, '']}
          labelFormatter={(l: string) => l}
          cursor={{ stroke: '#7c3aed', strokeWidth: 1, strokeDasharray: '4 2' }}
        />

        <Area
          type="monotone"
          dataKey="commits"
          stroke="#7c3aed"
          strokeWidth={2}
          fill="url(#commitGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#7c3aed', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

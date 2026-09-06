'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

interface DataPoint {
  date: string
  value: number
}

interface RevenueChartProps {
  data: DataPoint[]
  period?: '3M' | '6M' | '12M' | 'ALL'
  onPeriodChange?: (period: '3M' | '6M' | '12M' | 'ALL') => void
  className?: string
}

export function RevenueChart({
  data,
  period = '3M',
  onPeriodChange,
  className
}: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-40 text-sm text-muted-foreground', className)}>
        No revenue data available
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  const chartHeight = 120
  const chartWidth = 100
  const padding = { top: 10, right: 10, bottom: 20, left: 10 }

  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * innerWidth + padding.left
    const y = innerHeight - ((d.value - minValue) / range) * innerHeight + padding.top
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${innerHeight + padding.top} L ${points[0].x} ${innerHeight + padding.top} Z`

  const periods: Array<'3M' | '6M' | '12M' | 'ALL'> = ['3M', '6M', '12M', 'ALL']

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null

  return (
    <div className={cn('space-y-3', className)}>
      {hoveredPoint && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(hoveredPoint.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span className="text-sm font-semibold">{formatCurrency(hoveredPoint.value)}</span>
        </div>
      )}

      <div className="relative h-32">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--primary))" />
            </linearGradient>
          </defs>

          <line
            x1={padding.left}
            y1={innerHeight + padding.top}
            x2={chartWidth - padding.right}
            y2={innerHeight + padding.top}
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />

          <path d={areaPath} fill="url(#areaGradient)" className="transition-opacity duration-200" />

          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={hoveredIndex === i ? 4 : 2}
              fill={hoveredIndex === i ? 'hsl(var(--primary))' : 'hsl(var(--card))'}
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>
      </div>

      {onPeriodChange && (
        <div className="flex items-center justify-center gap-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={cn(
                'px-2.5 py-1 text-2xs font-medium rounded-md transition-colors',
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

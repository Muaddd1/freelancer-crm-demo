'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  trend?: {
    value: number
    label?: string
  }
  variant?: 'default' | 'prominent' | 'compact'
  className?: string
}

export function MetricCard({
  label,
  value,
  trend,
  variant = 'default',
  className
}: MetricCardProps) {
  const isPositive = trend && trend.value >= 0

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div>
          <p className="text-2xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{value}</span>
            {trend && (
              <span className={cn(
                'flex items-center gap-0.5 text-2xs font-medium',
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'prominent') {
    return (
      <div className={cn('glass-panel rounded-xl p-4', className)}>
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">{label}</p>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold tracking-tight">{value}</span>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mb-1 text-sm font-medium',
              isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            )}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isPositive ? '+' : ''}{trend.value}%</span>
              {trend.label && <span className="text-muted-foreground text-xs">{trend.label}</span>}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        {trend && (
          <span className={cn(
            'flex items-center gap-0.5 mb-0.5 text-xs font-medium',
            isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          )}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
    </div>
  )
}

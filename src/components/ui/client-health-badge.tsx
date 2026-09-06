'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ClientHealthStatus, getClientHealthLabel, getClientHealthDescription, ClientHealth } from '@/lib/utils'

interface ClientHealthBadgeProps {
  status: ClientHealthStatus
  health?: ClientHealth
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ClientHealthBadge({
  status,
  health,
  showLabel = true,
  size = 'md',
  className
}: ClientHealthBadgeProps) {
  const description = health ? getClientHealthDescription(health) : null

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  const labelSizes = {
    sm: 'text-2xs',
    md: 'text-xs',
    lg: 'text-sm',
  }

  const dotClass = status === 'healthy'
    ? 'bg-emerald-500 dark:bg-emerald-400'
    : status === 'attention'
    ? 'bg-amber-500 dark:bg-amber-400'
    : 'bg-red-500 dark:bg-red-400'

  const badge = (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className={cn('rounded-full', dotSizes[size], dotClass)} />
      {showLabel && (
        <span className={cn('font-medium', labelSizes[size])}>
          {getClientHealthLabel(status)}
        </span>
      )}
    </div>
  )

  if (description) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium">{getClientHealthLabel(status)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return badge
}

export function ClientHealthIndicator({
  status,
  showLabel = false,
  className
}: {
  status: ClientHealthStatus
  showLabel?: boolean
  className?: string
}) {
  return (
    <ClientHealthBadge
      status={status}
      showLabel={showLabel}
      size="sm"
      className={className}
    />
  )
}

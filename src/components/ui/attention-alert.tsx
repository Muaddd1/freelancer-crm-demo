'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { ArrowRight, FileText, Clock, AlertCircle } from 'lucide-react'

export type AlertType = 'overdue' | 'attention' | 'action'

interface AttentionAlertProps {
  type: AlertType
  client: {
    id: string
    name: string
    company?: string | null
    avatar?: string | null
  }
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondaryAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  timestamp?: string
  className?: string
}

const alertConfig = {
  overdue: {
    borderClass: 'alert-border-at-risk',
    icon: AlertCircle,
    iconClass: 'text-red-600 dark:text-red-400',
  },
  attention: {
    borderClass: 'alert-border-attention',
    icon: Clock,
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  action: {
    borderClass: 'alert-border-healthy',
    icon: FileText,
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
}

export function AttentionAlert({
  type,
  client,
  description,
  action,
  secondaryAction,
  timestamp,
  className
}: AttentionAlertProps) {
  const config = alertConfig[type]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-3 rounded-lg border bg-card transition-all duration-200',
        'hover:shadow-card card-lift',
        config.borderClass,
        className
      )}
    >
      <Avatar className="w-9 h-9 mt-0.5">
        <AvatarFallback className="bg-muted text-xs font-semibold">
          {getInitials(client.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-sm truncate">{client.name}</span>
          {client.company && (
            <span className="text-xs text-muted-foreground truncate">· {client.company}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', config.iconClass)} />
          <span className="truncate">{description}</span>
          {timestamp && <span className="ml-auto flex-shrink-0">{timestamp}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
        {secondaryAction && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {secondaryAction.label}
          </Button>
        )}
        {action && (
          <Button size="sm" className="h-7 text-xs gap-1">
            {action.label}
            <ArrowRight className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

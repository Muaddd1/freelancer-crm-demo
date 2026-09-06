'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'
import {
  DollarSign, FileText, MessageSquare, Clock,
  Upload, Send, CreditCard, Briefcase, Calendar, Edit, CheckCircle
} from 'lucide-react'

export interface TimelineItem {
  id: string
  type: 'payment' | 'proposal' | 'invoice' | 'contract' | 'message' | 'project' | 'task' | 'file' | 'activity' | 'meeting' | 'note'
  title: string
  description?: string
  amount?: number
  timestamp: Date | string
  link?: {
    href: string
    label?: string
  }
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const activityIcons: Record<TimelineItem['type'], typeof DollarSign> = {
  payment: DollarSign,
  proposal: FileText,
  invoice: FileText,
  contract: FileText,
  message: MessageSquare,
  project: Briefcase,
  task: CheckCircle,
  file: Upload,
  activity: Clock,
  meeting: Calendar,
  note: Edit,
}

const activityColors: Record<TimelineItem['type'], string> = {
  payment: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  proposal: 'text-violet-600 dark:text-violet-400 bg-violet-500/10',
  invoice: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  contract: 'text-violet-600 dark:text-violet-400 bg-violet-500/10',
  message: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
  project: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
  task: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  file: 'text-slate-600 dark:text-slate-400 bg-slate-500/10',
  activity: 'text-slate-600 dark:text-slate-400 bg-slate-500/10',
  meeting: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
  note: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
}

function formatDateHeader(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (itemDate.getTime() === today.getTime()) return 'Today'
  if (itemDate.getTime() === yesterday.getTime()) return 'Yesterday'

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function groupByDate(items: TimelineItem[]): Map<string, TimelineItem[]> {
  const groups = new Map<string, TimelineItem[]>()

  const sorted = [...items].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  for (const item of sorted) {
    const date = new Date(item.timestamp)
    const key = date.toDateString()

    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(item)
  }

  return groups
}

export function Timeline({ items, className }: TimelineProps) {
  const grouped = groupByDate(items)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No activity yet</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {Array.from(grouped.entries()).map(([dateKey, dateItems]) => (
        <div key={dateKey}>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 px-1">
            {formatDateHeader(new Date(dateKey))}
          </h4>
          <div className="space-y-1 timeline-connector">
            {dateItems.map((item, index) => {
              const Icon = activityIcons[item.type]
              const colorClass = activityColors[item.type]

              return (
                <div
                  key={item.id}
                  className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors animate-slide-right"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center', colorClass)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      {item.amount !== undefined && (
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          ${item.amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                    {item.link && (
                      <a
                        href={item.link.href}
                        className="text-xs text-primary hover:underline mt-1 inline-block"
                      >
                        {item.link.label || 'View'}
                      </a>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 mt-0.5">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { LayoutGrid, List, Columns, Square } from 'lucide-react'

export type ViewType = 'table' | 'cards' | 'kanban' | 'compact'

interface ViewSwitcherProps {
  value: ViewType
  onChange: (view: ViewType) => void
  className?: string
}

const views: { value: ViewType; icon: typeof LayoutGrid; label: string }[] = [
  { value: 'table', icon: List, label: 'Table view' },
  { value: 'cards', icon: LayoutGrid, label: 'Card view' },
  { value: 'kanban', icon: Columns, label: 'Kanban view' },
  { value: 'compact', icon: Square, label: 'Compact view' },
]

export function ViewSwitcher({ value, onChange, className }: ViewSwitcherProps) {
  return (
    <div className={cn('flex items-center bg-muted/50 rounded-lg p-0.5 gap-0.5', className)}>
      {views.map((view) => {
        const Icon = view.icon
        const isActive = value === view.value

        return (
          <button
            key={view.value}
            onClick={() => onChange(view.value)}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150',
              isActive
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
            title={view.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        )
      })}
    </div>
  )
}

const STORAGE_KEY = 'crm-clients-view'

export function useClientView() {
  const [view, setView] = React.useState<ViewType>(() => {
    if (typeof window === 'undefined') return 'table'
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && ['table', 'cards', 'kanban', 'compact'].includes(stored)) {
      return stored as ViewType
    }
    return 'table'
  })

  const changeView = (newView: ViewType) => {
    setView(newView)
    localStorage.setItem(STORAGE_KEY, newView)
  }

  return { view, changeView }
}

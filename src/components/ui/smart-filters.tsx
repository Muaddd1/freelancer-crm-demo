'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { SlidersHorizontal, X, Save, Bookmark } from 'lucide-react'

export interface FilterState {
  status: string[]
  health: string[]
  tags: string[]
  hasOutstanding: boolean | null
  hasActiveProject: boolean | null
}

interface SmartFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onSaveFilter?: (name: string) => void
  savedFilters?: { name: string; filters: FilterState }[]
  onApplySavedFilter?: (filters: FilterState) => void
  className?: string
}

const defaultFilters: FilterState = {
  status: [],
  health: [],
  tags: [],
  hasOutstanding: null,
  hasActiveProject: null,
}

export function SmartFilters({
  filters,
  onChange,
  className
}: SmartFiltersProps) {
  const [showSaveDialog, setShowSaveDialog] = React.useState(false)
  const [filterName, setFilterName] = React.useState('')

  const activeFilterCount = [
    filters.status.length > 0,
    filters.health.length > 0,
    filters.tags.length > 0,
    filters.hasOutstanding !== null,
    filters.hasActiveProject !== null,
  ].filter(Boolean).length

  const handleStatusChange = (value: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, value]
      : filters.status.filter(s => s !== value)
    onChange({ ...filters, status: newStatus })
  }

  const handleHealthChange = (value: string, checked: boolean) => {
    const newHealth = checked
      ? [...filters.health, value]
      : filters.health.filter(h => h !== value)
    onChange({ ...filters, health: newHealth })
  }

  const handleClearFilters = () => {
    onChange(defaultFilters)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('gap-1.5', activeFilterCount > 0 && 'border-primary')}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-2xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-0.5 px-1.5 text-xs h-6"
              onClick={handleClearFilters}
            >
              Clear all
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">Status</p>
          <DropdownMenuCheckboxItem
            checked={filters.status.includes('ACTIVE')}
            onCheckedChange={(checked) => handleStatusChange('ACTIVE', checked)}
          >
            Active
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status.includes('INACTIVE')}
            onCheckedChange={(checked) => handleStatusChange('INACTIVE', checked)}
          >
            Inactive
          </DropdownMenuCheckboxItem>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">Health</p>
          <DropdownMenuCheckboxItem
            checked={filters.health.includes('healthy')}
            onCheckedChange={(checked) => handleHealthChange('healthy', checked)}
          >
            <span className="w-2 h-2 rounded-full mr-2 bg-emerald-500" />
            Healthy
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.health.includes('attention')}
            onCheckedChange={(checked) => handleHealthChange('attention', checked)}
          >
            <span className="w-2 h-2 rounded-full mr-2 bg-amber-500" />
            Needs Attention
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.health.includes('at-risk')}
            onCheckedChange={(checked) => handleHealthChange('at-risk', checked)}
          >
            <span className="w-2 h-2 rounded-full mr-2 bg-red-500" />
            At Risk
          </DropdownMenuCheckboxItem>
        </div>

        <DropdownMenuSeparator />

        <div className="p-2">
          <p className="text-2xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">Special</p>
          <DropdownMenuCheckboxItem
            checked={filters.hasOutstanding === true}
            onCheckedChange={(checked) => onChange({ ...filters, hasOutstanding: checked ? true : null })}
          >
            Has Outstanding
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.hasActiveProject === true}
            onCheckedChange={(checked) => onChange({ ...filters, hasActiveProject: checked ? true : null })}
          >
            Has Active Project
          </DropdownMenuCheckboxItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ActiveFilters({ filters, onRemove, className }: {
  filters: FilterState
  onRemove: (key: keyof FilterState, value?: string) => void
  className?: string
}) {
  const chips: { label: string; key: keyof FilterState; value?: string }[] = []

  filters.status.forEach(s => chips.push({ label: `Status: ${s}`, key: 'status', value: s }))
  filters.health.forEach(h => chips.push({ label: `Health: ${h}`, key: 'health', value: h }))

  if (chips.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {chips.map((chip) => (
        <Badge key={`${chip.key}-${chip.value}`} variant="secondary" className="gap-1 pr-1">
          {chip.label}
          <button
            onClick={() => onRemove(chip.key, chip.value)}
            className="ml-0.5 hover:bg-muted rounded-sm p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}

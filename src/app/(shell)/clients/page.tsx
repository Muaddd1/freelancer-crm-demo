'use client'

import * as React from 'react'
import Link from 'next/link'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MetricCard } from '@/components/ui/metric-card'
import { ViewSwitcher, useClientView } from '@/components/ui/view-switcher'
import { SmartFilters, ActiveFilters, type FilterState } from '@/components/ui/smart-filters'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ConfirmDialog } from '@/components/ui/dialog'
import { ClientHealthIndicator } from '@/components/ui/client-health-badge'
import { formatCompactCurrency, getInitials, calculateClientHealth } from '@/lib/utils'
import { useToast } from '@/lib/toast-context'
import {
  Plus, Search, Users, ArrowUpRight, Download, Upload, Briefcase,
  MoreHorizontal, Trash2, Edit, Eye
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ClientsPage() {
  const { data, isLoaded, deleteClient, getClientRevenue, getInvoicesByClient, getProjectsByClient } = useData()
  const { toast } = useToast()
  const { view, changeView } = useClientView()
  const [search, setSearch] = React.useState('')
  const [filters, setFilters] = React.useState<FilterState>({
    status: [],
    health: [],
    tags: [],
    hasOutstanding: null,
    hasActiveProject: null,
  })
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  // Build client list with computed data
  const clientsWithData = React.useMemo(() => {
    return data.clients.map(client => {
      const revenue = getClientRevenue(client.id)
      const invoices = getInvoicesByClient(client.id)
      const projects = getProjectsByClient(client.id)
      const outstanding = invoices
        .filter(i => i.status !== 'PAID' && i.status !== 'VOID')
        .reduce((s, i) => s + (i.total - i.paid), 0)
      const health = calculateClientHealth({
        ...client,
        projects,
        invoices,
        proposals: [],
        contracts: [],
        payments: [],
        activities: [],
        messages: [],
      })
      return { ...client, revenue, outstanding, health, projectCount: projects.length }
    })
  }, [data.clients, getClientRevenue, getInvoicesByClient, getProjectsByClient])

  // Filter & sort
  const filteredClients = React.useMemo(() => {
    let result = [...clientsWithData]
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.company?.toLowerCase().includes(s)
      )
    }
    if (filters.status.length > 0) {
      result = result.filter(c => filters.status.includes(c.status))
    }
    if (filters.health.length > 0) {
      result = result.filter(c => filters.health.includes(c.health.status))
    }
    if (filters.hasOutstanding === true) {
      result = result.filter(c => c.outstanding > 0)
    }
    if (filters.hasActiveProject === true) {
      result = result.filter(c => c.projectCount > 0)
    }
    return result.sort((a, b) => b.revenue - a.revenue)
  }, [clientsWithData, search, filters])

  // Metrics
  const metrics = React.useMemo(() => {
    const activeClients = data.clients.filter(c => c.status === 'ACTIVE').length
    const totalRevenue = clientsWithData.reduce((s, c) => s + c.revenue, 0)
    const totalOutstanding = clientsWithData.reduce((s, c) => s + c.outstanding, 0)
    const atRiskCount = clientsWithData.filter(c => c.health.status === 'at-risk').length
    return { totalClients: data.clients.length, activeClients, totalRevenue, totalOutstanding, atRiskCount }
  }, [data.clients, clientsWithData])

  const handleDelete = () => {
    if (!deleteId) return
    const name = data.clients.find(c => c.id === deleteId)?.name || 'Client'
    deleteClient(deleteId)
    toast({ type: 'success', title: 'Client deleted', description: `${name} has been removed.` })
    setDeleteId(null)
  }

  if (!isLoaded) {
    return (
      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage relationships, projects, conversations and revenue from one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Link href="/clients/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-stretch gap-4 overflow-x-auto pb-2">
        <div className="flex-1 min-w-[140px]">
          <MetricCard label="Total Clients" value={metrics.totalClients} variant="compact" className="h-full" />
        </div>
        <div className="h-12 w-px bg-border hidden md:block" />
        <div className="flex-1 min-w-[100px]">
          <MetricCard label="Active" value={metrics.activeClients} variant="compact" className="h-full" />
        </div>
        <div className="h-12 w-px bg-border hidden lg:block" />
        <div className="flex-[2] min-w-[180px]">
          <div className="glass-panel rounded-xl p-4 h-full">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Revenue</p>
            <div className="flex items-end gap-3 mt-1">
              <span className="text-3xl font-bold tracking-tight">{formatCompactCurrency(metrics.totalRevenue)}</span>
              <span className="flex items-center gap-0.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                <ArrowUpRight className="w-4 h-4" />
                +12.4%
              </span>
            </div>
          </div>
        </div>
        <div className="h-12 w-px bg-border hidden xl:block" />
        <div className="flex-1 min-w-[130px]">
          <MetricCard label="Outstanding" value={formatCompactCurrency(metrics.totalOutstanding)} variant="compact" className="h-full" />
        </div>
        <div className="h-12 w-px bg-border hidden md:block" />
        <div className="flex-1 min-w-[100px]">
          <div className="flex items-center gap-2 h-full">
            <span className="text-red-500 dark:text-red-400 font-semibold text-lg">{metrics.atRiskCount}</span>
            <span className="text-xs text-muted-foreground">At Risk</span>
          </div>
        </div>
      </div>

      {/* Directory */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients, companies, projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <SmartFilters filters={filters} onChange={setFilters} />
          <ViewSwitcher value={view} onChange={changeView} />
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        <ActiveFilters
          filters={filters}
          onRemove={(key, value) => {
            if (value) {
              if (key === 'status') {
                setFilters(prev => ({ ...prev, status: prev.status.filter((v: string) => v !== value) }))
              } else if (key === 'health') {
                setFilters(prev => ({ ...prev, health: prev.health.filter((v: string) => v !== value) }))
              }
            } else {
              setFilters(prev => ({
                ...prev,
                [key]: key === 'hasOutstanding' || key === 'hasActiveProject' ? null : [],
              }))
            }
          }}
        />

        {/* Client Table */}
        {filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No clients found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {search || filters.status.length > 0 || filters.health.length > 0
                ? "No clients match your search or filters."
                : "Get started by adding your first client."}
            </p>
            {!search && filters.status.length === 0 && filters.health.length === 0 && (
              <Link href="/clients/new" className="mt-4">
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Add Client
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b text-2xs font-medium text-muted-foreground uppercase tracking-wide">
              <div className="col-span-3">Client</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Active Project</div>
              <div className="col-span-2 text-right">Revenue</div>
              <div className="col-span-2 text-right">Outstanding</div>
              <div className="col-span-1 text-center">Health</div>
              <div className="col-span-1" />
            </div>
            {/* Table Body */}
            <div className="divide-y">
              {filteredClients.map(client => {
                const activeProject = data.projects.find(p => p.clientId === client.id && p.status === 'ACTIVE')
                return (
                  <div
                    key={client.id}
                    className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <Link href={`/clients/${client.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="w-9 h-9 flex-shrink-0">
                          <AvatarFallback className="bg-muted text-xs font-semibold">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{client.name}</p>
                          {client.company && (
                            <p className="text-xs text-muted-foreground truncate">{client.company}</p>
                          )}
                        </div>
                      </Link>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <Badge variant={client.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-2xs">
                        {client.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="col-span-2 flex items-center">
                      {activeProject ? (
                        <Link
                          href={`/projects/${activeProject.id}`}
                          className="text-sm truncate flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Briefcase className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{activeProject.name}</span>
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      <span className="text-sm font-semibold">{formatCompactCurrency(client.revenue)}</span>
                    </div>
                    <div className="col-span-2 flex items-center justify-end">
                      {client.outstanding > 0 ? (
                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                          {formatCompactCurrency(client.outstanding)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <ClientHealthIndicator status={client.health.status} />
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/clients/${client.id}`} className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/clients/${client.id}?edit=true`} className="flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                            onClick={() => setDeleteId(client.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete client?"
        description="This will permanently delete the client and all associated data including projects, invoices, and proposals."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  )
}

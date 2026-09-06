'use client'

import * as React from 'react'
import Link from 'next/link'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatCompactCurrency, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ConfirmDialog } from '@/components/ui/dialog'
import { useToast } from '@/lib/toast-context'
import {
  Plus, Search, Receipt, ArrowRight, MoreHorizontal,
  Edit, Trash2, Eye, Send, Download, DollarSign
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const statusColors: Record<string, string> = {
  PAID: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  OVERDUE: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  DRAFT: 'bg-muted text-muted-foreground',
  VOID: 'bg-muted text-muted-foreground',
}

export default function InvoicesPage() {
  const { data, isLoaded, deleteInvoice, sendInvoice } = useData()
  const { toast } = useToast()
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const filtered = React.useMemo(() => {
    let result = [...data.invoices]
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(i =>
        i.number.toLowerCase().includes(s) ||
        data.clients.find(c => c.id === i.clientId)?.name.toLowerCase().includes(s)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(i => i.status === statusFilter)
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [data.invoices, data.clients, search, statusFilter])

  const stats = React.useMemo(() => {
    const total = data.invoices.reduce((s, i) => s + i.total, 0)
    const paid = data.invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.total, 0)
    const outstanding = data.invoices.filter(i => i.status !== 'PAID' && i.status !== 'VOID').reduce((s, i) => s + (i.total - i.paid), 0)
    const overdue = data.invoices.filter(i => i.status === 'OVERDUE').length
    return { total, paid, outstanding, overdue }
  }, [data.invoices])

  const handleDelete = () => {
    if (!deleteId) return
    deleteInvoice(deleteId)
    toast({ type: 'success', title: 'Invoice deleted' })
    setDeleteId(null)
  }

  const handleSend = (id: string) => {
    sendInvoice(id)
    toast({ type: 'success', title: 'Invoice sent', description: 'The invoice has been marked as sent.' })
  }

  if (!isLoaded) {
    return <div className="p-6"><Skeleton className="h-64" /></div>
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage billing and track payments.</p>
        </div>
        <Link href="/invoices/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Total Invoiced</p>
          <p className="text-xl font-bold mt-1">{formatCompactCurrency(stats.total)}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Paid</p>
          <p className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{formatCompactCurrency(stats.paid)}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Outstanding</p>
          <p className="text-xl font-bold mt-1 text-amber-600 dark:text-amber-400">{formatCompactCurrency(stats.outstanding)}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Overdue</p>
          <p className="text-xl font-bold mt-1 text-red-600 dark:text-red-400">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <select className="h-9 rounded-lg border bg-background px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Receipt className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="font-semibold">No invoices found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search || statusFilter !== 'all' ? 'Try a different search.' : 'Create your first invoice to get started.'}
          </p>
          {!search && statusFilter === 'all' && (
            <Link href="/invoices/new" className="mt-4">
              <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />New Invoice</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 border-b text-2xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="col-span-2">Invoice</div>
            <div className="col-span-2">Client</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2 text-right">Due</div>
            <div className="col-span-2" />
          </div>
          <div className="divide-y">
            {filtered.map(invoice => {
              const client = data.clients.find(c => c.id === invoice.clientId)
              const due = new Date(invoice.dueDate)
              const isOverdue = invoice.status === 'OVERDUE' || (invoice.status !== 'PAID' && due < new Date())
              return (
                <div key={invoice.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/30 transition-colors group">
                  <div className="col-span-2 flex items-center">
                    <Link href={`/invoices/${invoice.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                      {invoice.number}
                    </Link>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarFallback className="text-2xs">{getInitials(client?.name || '?')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate">{client?.name || 'Unknown'}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Badge variant="outline" className={`text-2xs ${statusColors[invoice.status]}`}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <span className="text-sm font-semibold">{formatCurrency(invoice.total)}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <span className={`text-sm ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-muted-foreground'}`}>
                      {due.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {invoice.status === 'DRAFT' && (
                      <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={() => handleSend(invoice.id)}>
                        <Send className="w-3 h-3" /> Send
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/invoices/${invoice.id}`} className="flex items-center gap-2">
                            <Eye className="w-4 h-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/invoices/${invoice.id}?edit=true`} className="flex items-center gap-2">
                            <Edit className="w-4 h-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(invoice.id)}>
                          <Trash2 className="w-4 h-4" /> Delete
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

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete invoice?" description="This action cannot be undone." confirmLabel="Delete" variant="destructive" />
    </div>
  )
}

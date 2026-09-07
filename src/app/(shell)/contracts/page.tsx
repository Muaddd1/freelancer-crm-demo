'use client'

import * as React from 'react'
import Link from 'next/link'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatCompactCurrency } from '@/lib/utils'
import { ConfirmDialog } from '@/components/ui/dialog'
import { useToast } from '@/lib/toast-context'
import {
  Plus, Search, FileSignature, MoreHorizontal,
  Edit, Trash2, Eye
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const statusColors: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  SIGNED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  EXPIRED: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  VOID: 'bg-muted text-muted-foreground',
}

export default function ContractsPage() {
  const { data, isLoaded, deleteContract } = useData()
  const { toast } = useToast()
  const [search, setSearch] = React.useState('')
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const filtered = React.useMemo(() => {
    let result = [...data.contracts]
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(s) ||
        data.clients.find(cl => cl.id === c.clientId)?.name.toLowerCase().includes(s)
      )
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [data.contracts, data.clients, search])

  const stats = React.useMemo(() => {
    const total = data.contracts.filter(c => c.status === 'SIGNED').reduce((s, c) => s + c.value, 0)
    const active = data.contracts.filter(c => c.status === 'SIGNED').length
    return { total, active }
  }, [data.contracts])

  const handleDelete = () => {
    if (!deleteId) return
    deleteContract(deleteId)
    toast({ type: 'success', title: 'Contract deleted' })
    setDeleteId(null)
  }

  if (!isLoaded) return <div className="p-6"><Skeleton className="h-64" /></div>

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage client contracts and agreements.</p>
        </div>
        <Link href="/contracts/new">
          <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />New Contract</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Total Contract Value</p>
          <p className="text-xl font-bold mt-1">{formatCompactCurrency(stats.total)}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Active Contracts</p>
          <p className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{stats.active}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search contracts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileSignature className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="font-semibold">No contracts found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? 'Try a different search.' : 'Create your first contract.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(contract => {
            const client = data.clients.find(c => c.id === contract.clientId)
            return (
              <div key={contract.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <FileSignature className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/contracts/${contract.id}`} className="font-medium hover:text-primary transition-colors">
                      {contract.name}
                    </Link>
                    <Badge variant="outline" className={`text-2xs ${statusColors[contract.status]}`}>
                      {contract.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    {client && <span>{client.name}</span>}
                    {contract.signedAt && <><span>·</span><span>Signed {new Date(contract.signedAt).toLocaleDateString()}</span></>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold">{formatCurrency(contract.value)}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild><Link href={`/contracts/${contract.id}`} className="flex items-center gap-2"><Eye className="w-4 h-4" /> View</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href={`/contracts/${contract.id}?edit=true`} className="flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(contract.id)}><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete contract?" description="This action cannot be undone." confirmLabel="Delete" variant="destructive" />
    </div>
  )
}

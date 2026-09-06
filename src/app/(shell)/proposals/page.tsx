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
  Plus, Search, FileText, ArrowRight, MoreHorizontal,
  Edit, Trash2, Eye, Send, Clock
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const statusColors: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  VIEWED: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  ACCEPTED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  DECLINED: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
}

export default function ProposalsPage() {
  const { data, isLoaded, deleteProposal, sendProposal } = useData()
  const { toast } = useToast()
  const [search, setSearch] = React.useState('')
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const filtered = React.useMemo(() => {
    let result = [...data.proposals]
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(s) ||
        data.clients.find(c => c.id === p.clientId)?.name.toLowerCase().includes(s)
      )
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [data.proposals, data.clients, search])

  const stats = React.useMemo(() => {
    const total = data.proposals.reduce((s, p) => s + p.total, 0)
    const pending = data.proposals.filter(p => p.status === 'SENT' || p.status === 'VIEWED').length
    const accepted = data.proposals.filter(p => p.status === 'ACCEPTED').length
    const acceptedValue = data.proposals.filter(p => p.status === 'ACCEPTED').reduce((s, p) => s + p.total, 0)
    return { total, pending, accepted, acceptedValue }
  }, [data.proposals])

  const handleDelete = () => {
    if (!deleteId) return
    deleteProposal(deleteId)
    toast({ type: 'success', title: 'Proposal deleted' })
    setDeleteId(null)
  }

  const handleSend = (id: string) => {
    sendProposal(id)
    toast({ type: 'success', title: 'Proposal sent' })
  }

  if (!isLoaded) return <div className="p-6"><Skeleton className="h-64" /></div>

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proposals</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and track project proposals.</p>
        </div>
        <Link href="/proposals/new">
          <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />New Proposal</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Total Value</p>
          <p className="text-xl font-bold mt-1">{formatCompactCurrency(stats.total)}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Pending</p>
          <p className="text-xl font-bold mt-1 text-amber-600 dark:text-amber-400">{stats.pending}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Accepted</p>
          <p className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{stats.accepted}</p>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <p className="text-2xs text-muted-foreground uppercase tracking-wide">Won Value</p>
          <p className="text-xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{formatCompactCurrency(stats.acceptedValue)}</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search proposals..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="font-semibold">No proposals found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? 'Try a different search.' : 'Create your first proposal.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(proposal => {
            const client = data.clients.find(c => c.id === proposal.clientId)
            return (
              <div key={proposal.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/proposals/${proposal.id}`} className="font-medium hover:text-primary transition-colors">
                      {proposal.name}
                    </Link>
                    <Badge variant="outline" className={`text-2xs ${statusColors[proposal.status]}`}>
                      {proposal.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    {client && <span>{client.name}</span>}
                    {proposal.viewedAt && <><span>·</span><Clock className="w-3 h-3" /><span>Viewed {new Date(proposal.viewedAt).toLocaleDateString()}</span></>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold">{formatCurrency(proposal.total)}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  {proposal.status === 'DRAFT' && (
                    <Button size="sm" variant="ghost" className="h-7 gap-1" onClick={() => handleSend(proposal.id)}>
                      <Send className="w-3 h-3" /> Send
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild><Link href={`/proposals/${proposal.id}`} className="flex items-center gap-2"><Eye className="w-4 h-4" /> View</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href={`/proposals/${proposal.id}?edit=true`} className="flex items-center gap-2"><Edit className="w-4 h-4" /> Edit</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(proposal.id)}><Trash2 className="w-4 h-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete proposal?" description="This action cannot be undone." confirmLabel="Delete" variant="destructive" />
    </div>
  )
}

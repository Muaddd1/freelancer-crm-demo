'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCurrency, getInitials } from '@/lib/utils'
import { ArrowLeft, Send, Download, ExternalLink } from 'lucide-react'
import { useToast } from '@/lib/toast-context'

const statusColors: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  VIEWED: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  ACCEPTED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  DECLINED: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
}

export default function ProposalDetailPage() {
  const params = useParams()
  const { data, isLoaded, sendProposal } = useData()
  const { toast } = useToast()
  const proposalId = params.id as string
  const proposal = data.proposals.find(p => p.id === proposalId)
  const client = proposal ? data.clients.find(c => c.id === proposal.clientId) : null

  if (!isLoaded) return <div className="p-6">Loading...</div>
  if (!proposal) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">Proposal not found</h2>
        <Link href="/proposals"><Button variant="outline" className="mt-4 gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></Link>
      </div>
    )
  }

  const project = proposal.projectId ? data.projects.find(p => p.id === proposal.projectId) : null

  const handleSend = () => {
    sendProposal(proposalId)
    toast({ type: 'success', title: 'Proposal sent', description: 'The proposal has been sent to the client.' })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/proposals" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Proposals
            </Link>
            <span>/</span>
            <span className="text-foreground">{proposal.name}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{proposal.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className={statusColors[proposal.status]}>{proposal.status}</Badge>
                {proposal.viewedAt && <span className="text-sm text-muted-foreground">Viewed {new Date(proposal.viewedAt).toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {proposal.status === 'DRAFT' && (
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSend}>
                  <Send className="w-4 h-4" /> Send
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="w-4 h-4" /> Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-semibold mb-3">Proposal Items</h3>
              <div className="rounded-lg border bg-card">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 border-b text-2xs font-medium text-muted-foreground uppercase">
                  <div className="col-span-8">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                {proposal.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-3 border-b last:border-0">
                    <div className="col-span-8 text-sm">{item.description}</div>
                    <div className="col-span-2 text-sm text-right">{item.quantity}</div>
                    <div className="col-span-2 text-sm text-right font-medium">{formatCurrency(item.amount)}</div>
                  </div>
                ))}
                <div className="px-4 py-3 bg-muted/30 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(proposal.total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {client && (
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold mb-3">Prepared For</h3>
                <Link href={`/clients/${client.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Avatar><AvatarFallback>{getInitials(client.name)}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-medium text-sm">{client.name}</p>
                    {client.company && <p className="text-xs text-muted-foreground">{client.company}</p>}
                  </div>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </Link>
              </div>
            )}

            <div className="rounded-xl border bg-card p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(proposal.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valid For</span>
                <span>{proposal.validityDays} days</span>
              </div>
              {project && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project</span>
                  <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">{project.name}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

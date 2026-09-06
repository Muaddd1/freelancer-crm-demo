'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowLeft, ExternalLink, FileSignature } from 'lucide-react'

const statusColors: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  SIGNED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  EXPIRED: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  VOID: 'bg-muted text-muted-foreground',
}

export default function ContractDetailPage() {
  const params = useParams()
  const { data, isLoaded } = useData()
  const contractId = params.id as string
  const contract = data.contracts.find(c => c.id === contractId)
  const client = contract ? data.clients.find(c => c.id === contract.clientId) : null

  if (!isLoaded) return <div className="p-6">Loading...</div>
  if (!contract) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">Contract not found</h2>
        <Link href="/contracts"><Button variant="outline" className="mt-4 gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></Link>
      </div>
    )
  }

  const project = contract.projectId ? data.projects.find(p => p.id === contract.projectId) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/contracts" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Contracts
            </Link>
            <span>/</span>
            <span className="text-foreground">{contract.name}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{contract.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className={statusColors[contract.status]}>{contract.status}</Badge>
                <span className="text-2xl font-bold">{formatCurrency(contract.value)}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileSignature className="w-4 h-4" /> Download
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          {client && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-3">Client</h3>
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

          {project && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-3">Project</h3>
              <Link href={`/projects/${project.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                <p className="font-medium text-sm">{project.name}</p>
                <ExternalLink className="w-3 h-3 ml-auto" />
              </Link>
            </div>
          )}

          <div className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(contract.createdAt).toLocaleDateString()}</span>
            </div>
            {contract.signedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Signed</span>
                <span>{new Date(contract.signedAt).toLocaleDateString()}</span>
              </div>
            )}
            {contract.expiresAt && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expires</span>
                <span>{new Date(contract.expiresAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {contract.notes && (
            <div className="rounded-xl border bg-card p-5 col-span-2">
              <h3 className="font-semibold mb-3">Notes</h3>
              <p className="text-sm text-muted-foreground">{contract.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

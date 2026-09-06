'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useData } from '@/lib/data-context'
import { useToast } from '@/lib/toast-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCompactCurrency, getInitials } from '@/lib/utils'
import { ArrowLeft, Briefcase, Clock, DollarSign, Edit, ExternalLink } from 'lucide-react'

const statusColors: Record<string, string> = {
  PLANNING: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  ON_HOLD: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  COMPLETED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-muted text-muted-foreground',
}

export default function ProjectDetailPage() {
  const params = useParams()
  const { data, isLoaded, getProjectsByClient, getInvoicesByClient } = useData()
  const { toast } = useToast()

  const projectId = params.id as string
  const project = data.projects.find(p => p.id === projectId)
  const client = project ? data.clients.find(c => c.id === project.clientId) : null
  const invoices = project ? getInvoicesByClient(project.clientId).filter(i => i.projectId === projectId) : []

  if (!isLoaded) return <div className="p-6">Loading...</div>
  if (!project) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">Project not found</h2>
        <Link href="/projects">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    )
  }

  const clientInvoices = getInvoicesByClient(project.clientId)
  const projectInvoices = clientInvoices.filter(i => i.projectId === projectId)
  const totalInvoiced = projectInvoices.reduce((s, i) => s + i.total, 0)
  const totalPaid = projectInvoices.reduce((s, i) => s + i.paid, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="p-6 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/projects" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Projects
            </Link>
            <span>/</span>
            <span className="text-foreground">{project.name}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{project.name}</h1>
                  <Badge variant="outline" className={statusColors[project.status]}>
                    {project.status}
                  </Badge>
                </div>
                {client && (
                  <Link href={`/clients/${client.id}`} className="flex items-center gap-2 mt-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    {client.name}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
            <Link href={`/projects/${project.id}?edit=true`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Edit className="w-4 h-4" />
                Edit Project
              </Button>
            </Link>
          </div>

          {project.description && (
            <p className="text-sm text-muted-foreground mt-4 max-w-2xl">{project.description}</p>
          )}
        </div>
      </div>

      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide">Project Budget</p>
                <p className="text-xl font-bold">{project.budget ? formatCompactCurrency(project.budget) : '—'}</p>
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide">Total Invoiced</p>
                <p className="text-xl font-bold">{totalInvoiced > 0 ? formatCompactCurrency(totalInvoiced) : '—'}</p>
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide">Deadline</p>
                <p className="text-xl font-bold">
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices for this project */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold">Project Invoices</h2>
          {projectInvoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg">
              No invoices linked to this project yet.
            </div>
          ) : (
            <div className="rounded-lg border bg-card divide-y">
              {projectInvoices.map(invoice => (
                <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{invoice.number}</p>
                    <p className="text-xs text-muted-foreground">Due {new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCompactCurrency(invoice.total)}</p>
                    <Badge variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'OVERDUE' ? 'destructive' : 'secondary'} className="text-2xs mt-1">
                      {invoice.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

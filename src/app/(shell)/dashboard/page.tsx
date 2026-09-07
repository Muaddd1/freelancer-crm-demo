'use client'

import * as React from 'react'
import Link from 'next/link'
import { useData } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MetricCard } from '@/components/ui/metric-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCompactCurrency, getInitials } from '@/lib/utils'
import {
  ArrowUpRight, TrendingUp, Users, Briefcase, Receipt,
  FileText, AlertCircle, ArrowRight, Plus, DollarSign,
  Eye
} from 'lucide-react'

export default function DashboardPage() {
  const { data, isLoaded, getDashboardStats } = useData()
  const stats = getDashboardStats()

  if (!isLoaded) {
    return (
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 col-span-2" />
        </div>
      </div>
    )
  }

  // Get recent invoices
  const recentInvoices = [...data.invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Get active projects
  const activeProjects = data.projects
    .filter(p => p.status === 'ACTIVE')
    .slice(0, 5)

  // Get pending proposals
  const pendingProposals = data.proposals
    .filter(p => p.status === 'SENT' || p.status === 'VIEWED')
    .slice(0, 5)

  // Overdue invoices
  const overdueInvoices = data.invoices.filter(i => i.status === 'OVERDUE')

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back. Here&apos;s what&apos;s happening with your business.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <DollarSign className="w-4 h-4" />
            Record Payment
          </Button>
          <Link href="/clients/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              New Client
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="glass-panel rounded-xl p-5 h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide font-medium">Total Revenue</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-foreground">{formatCompactCurrency(stats.totalRevenue)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3" />
              <span>+{formatCompactCurrency(stats.monthlyRevenue)} this month</span>
            </div>
          </div>
        </div>

        <MetricCard
          label="Outstanding"
          value={formatCompactCurrency(stats.outstanding)}
          trend={stats.outstanding > 0 ? `${data.invoices.filter(i => i.status === 'OVERDUE').length} overdue` : undefined}
          trendDirection={stats.outstanding > 0 ? 'down' : 'up'}
          className="col-span-1"
        />

        <MetricCard
          label="Active Clients"
          value={stats.activeClients}
          trend={`${stats.activeProjects} active projects`}
          className="col-span-1"
        />

        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <div className={`
            rounded-xl p-5 h-full border
            ${overdueInvoices.length > 0
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
              : 'bg-card border-border'
            }
          `}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                overdueInvoices.length > 0
                  ? 'bg-red-500/10'
                  : 'bg-muted'
              }`}>
                <AlertCircle className={`w-5 h-5 ${
                  overdueInvoices.length > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-muted-foreground'
                }`} />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide font-medium">
                  {overdueInvoices.length > 0 ? 'Overdue Invoices' : 'Overdue Invoices'}
                </p>
                <span className={`text-2xl font-bold tracking-tight ${
                  overdueInvoices.length > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-foreground'
                }`}>
                  {overdueInvoices.length}
                </span>
              </div>
            </div>
            {overdueInvoices.length > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                {formatCompactCurrency(overdueInvoices.reduce((s, i) => s + (i.total - i.paid), 0))} at risk
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Active Projects</h2>
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="gap-1 h-8">
                View all <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {activeProjects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No active projects
              </div>
            ) : (
              activeProjects.map(project => {
                const client = data.clients.find(c => c.id === project.clientId)
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{project.name}</p>
                          <Badge variant="success" className="text-2xs">Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {client?.name} {client?.company && `· ${client.company}`}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {project.budget && (
                          <p className="text-sm font-semibold">{formatCompactCurrency(project.budget)}</p>
                        )}
                        {project.deadline && (
                          <p className="text-2xs text-muted-foreground">
                            Due {new Date(project.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Proposals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Pending Proposals</h2>
              <Link href="/proposals">
                <Button variant="ghost" size="sm" className="gap-1 h-8">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {pendingProposals.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  No pending proposals
                </div>
              ) : (
                pendingProposals.map(proposal => {
                  const client = data.clients.find(c => c.id === proposal.clientId)
                  return (
                    <Link
                      key={proposal.id}
                      href={`/proposals/${proposal.id}`}
                      className="block"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors group">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-muted text-xs">
                            {getInitials(client?.name || '?')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{proposal.name}</p>
                          <p className="text-2xs text-muted-foreground truncate">{client?.name}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {proposal.status === 'VIEWED' && (
                            <Eye className="w-3 h-3 text-muted-foreground" />
                          )}
                          <Badge variant={proposal.status === 'VIEWED' ? 'warning' : 'secondary'} className="text-2xs">
                            {proposal.status === 'VIEWED' ? 'Viewed' : 'Sent'}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Recent Invoices</h2>
              <Link href="/invoices">
                <Button variant="ghost" size="sm" className="gap-1 h-8">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {recentInvoices.map(invoice => {
                const client = data.clients.find(c => c.id === invoice.clientId)
                return (
                  <Link
                    key={invoice.id}
                    href={`/invoices/${invoice.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors group">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-muted text-xs">
                          {getInitials(client?.name || '?')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{invoice.number}</p>
                          <Badge
                            variant={invoice.status === 'PAID' ? 'success' : invoice.status === 'OVERDUE' ? 'destructive' : 'secondary'}
                            className="text-2xs"
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-2xs text-muted-foreground truncate">{client?.name}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold">{formatCompactCurrency(invoice.total)}</p>
                        {invoice.status !== 'PAID' && invoice.total - invoice.paid > 0 && (
                          <p className="text-2xs text-muted-foreground">
                            {formatCompactCurrency(invoice.total - invoice.paid)} due
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/clients/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-11">
                  <Users className="w-4 h-4" />
                  New Client
                </Button>
              </Link>
              <Link href="/projects/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-11">
                  <Briefcase className="w-4 h-4" />
                  New Project
                </Button>
              </Link>
              <Link href="/invoices/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-11">
                  <Receipt className="w-4 h-4" />
                  New Invoice
                </Button>
              </Link>
              <Link href="/proposals/new">
                <Button variant="outline" className="w-full justify-start gap-2 h-11">
                  <FileText className="w-4 h-4" />
                  New Proposal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

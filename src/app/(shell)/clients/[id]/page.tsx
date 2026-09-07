'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useData } from '@/lib/data-context'
import { useToast } from '@/lib/toast-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, ConfirmDialog } from '@/components/ui/dialog'
import { ClientHealthIndicator } from '@/components/ui/client-health-badge'
import { formatCompactCurrency, formatCurrency, getInitials, calculateClientHealth } from '@/lib/utils'
import {
  ArrowLeft, Mail, Phone, Globe, Edit, Trash2, Plus,
  Briefcase, FileText, Receipt, MessageSquare,
  ArrowRight, ExternalLink, Send, DollarSign, Clock, CheckCircle,
  FileSignature, MoreHorizontal, TrendingUp
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data, isLoaded, getClient, deleteClient, getProjectsByClient, getInvoicesByClient,
    getProposalsByClient, getContractsByClient, getPaymentsByClient, getClientRevenue,
    deleteProject, deleteInvoice, deleteProposal, sendInvoice, sendProposal } = useData()
  const { toast } = useToast()

  const clientId = params.id as string
  const client = getClient(clientId)

  const [deleteType, setDeleteType] = React.useState<{ type: string; id: string; name: string } | null>(null)
  const [messageText, setMessageText] = React.useState('')
  const [showMessageDialog, setShowMessageDialog] = React.useState(false)

  if (!isLoaded) {
    return <div className="p-6">Loading...</div>
  }

  if (!client) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">Client not found</h2>
        <Link href="/clients">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Clients
          </Button>
        </Link>
      </div>
    )
  }

  const projects = getProjectsByClient(clientId)
  const invoices = getInvoicesByClient(clientId)
  const proposals = getProposalsByClient(clientId)
  const contracts = getContractsByClient(clientId)
  const payments = getPaymentsByClient(clientId)
  const revenue = getClientRevenue(clientId)
  const outstanding = invoices.filter(i => i.status !== 'PAID' && i.status !== 'VOID').reduce((s, i) => s + (i.total - i.paid), 0)

  const health = calculateClientHealth({
    ...client,
    projects, invoices, proposals, contracts, payments, activities: [], messages: data.messages.filter(m => m.clientId === clientId)
  })

  const activeProjects = projects.filter(p => p.status === 'ACTIVE')
  const activeProposals = proposals.filter(p => p.status === 'SENT' || p.status === 'VIEWED')

  const handleDelete = () => {
    if (!deleteType) return
    if (deleteType.type === 'client') {
      deleteClient(clientId)
      toast({ type: 'success', title: 'Client deleted' })
      router.push('/clients')
    } else if (deleteType.type === 'project') {
      deleteProject(deleteType.id)
      toast({ type: 'success', title: 'Project deleted' })
    } else if (deleteType.type === 'invoice') {
      deleteInvoice(deleteType.id)
      toast({ type: 'success', title: 'Invoice deleted' })
    } else if (deleteType.type === 'proposal') {
      deleteProposal(deleteType.id)
      toast({ type: 'success', title: 'Proposal deleted' })
    }
    setDeleteType(null)
  }

  const handleSendInvoice = (id: string) => {
    sendInvoice(id)
    toast({ type: 'success', title: 'Invoice sent', description: 'The invoice has been marked as sent.' })
  }

  const handleSendProposal = (id: string) => {
    sendProposal(id)
    toast({ type: 'success', title: 'Proposal sent', description: 'The proposal has been sent to the client.' })
  }

  const handleAddMessage = () => {
    if (!messageText.trim()) return
    toast({ type: 'success', title: 'Message saved', description: 'The message has been added to the conversation.' })
    setMessageText('')
    setShowMessageDialog(false)
  }

  const invoiceStatusColors: Record<string, string> = {
    PAID: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    OVERDUE: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    DRAFT: 'bg-muted text-muted-foreground',
    VOID: 'bg-muted text-muted-foreground',
  }

  const projectStatusColors: Record<string, string> = {
    PLANNING: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    ACTIVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    ON_HOLD: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    COMPLETED: 'bg-muted text-muted-foreground',
    CANCELLED: 'bg-muted text-muted-foreground',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="p-6 max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/clients" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Clients
            </Link>
            <span>/</span>
            <span className="text-foreground">{client.name}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{client.name}</h1>
                  <Badge variant={client.status === 'ACTIVE' ? 'success' : 'secondary'}>
                    {client.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </Badge>
                  <ClientHealthIndicator status={health.status} />
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  {client.company && <span>{client.company}</span>}
                  <a href={`mailto:${client.email}`} className="hover:text-primary flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {client.email}
                  </a>
                  {client.phone && (
                    <a href={`tel:${client.phone}`} className="hover:text-primary flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {client.phone}
                    </a>
                  )}
                  {client.website && (
                    <a href={`https://${client.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      {client.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowMessageDialog(true)}>
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
              <Link href={`/invoices/new?client=${client.id}`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Receipt className="w-4 h-4" />
                  Invoice
                </Button>
              </Link>
              <Link href={`/proposals/new?client=${client.id}`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <FileText className="w-4 h-4" />
                  Proposal
                </Button>
              </Link>
              <Link href={`/projects/new?client=${client.id}`}>
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Project
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/clients/${client.id}?edit=true`} className="flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Client
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                    onClick={() => setDeleteType({ type: 'client', id: client.id, name: client.name })}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Client
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t bg-muted/30">
          <div className="px-6 py-4 max-w-[1400px] mx-auto flex items-stretch gap-8 overflow-x-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide">Lifetime Revenue</p>
                <p className="text-lg font-bold">{formatCompactCurrency(revenue)}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide">Outstanding</p>
                <p className={`text-lg font-bold ${outstanding > 0 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                  {formatCompactCurrency(outstanding)}
                </p>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide">Projects</p>
                <p className="text-lg font-bold">{projects.length}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide">Proposals</p>
                <p className="text-lg font-bold">{proposals.length}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <FileSignature className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xs text-muted-foreground uppercase tracking-wide">Contracts</p>
                <p className="text-lg font-bold">{contracts.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-[1400px] mx-auto">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">
              Projects ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="invoices">
              Invoices ({invoices.length})
            </TabsTrigger>
            <TabsTrigger value="proposals">
              Proposals ({proposals.length})
            </TabsTrigger>
            <TabsTrigger value="contracts">
              Contracts ({contracts.length})
            </TabsTrigger>
            <TabsTrigger value="payments">
              Payments ({payments.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Messages ({data.messages.filter(m => m.clientId === clientId).length})
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''}
              </p>
              <Link href={`/projects/new?client=${client.id}`}>
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </Link>
            </div>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No projects yet</p>
                <Link href={`/projects/new?client=${client.id}`}>
                  <Button variant="outline" size="sm" className="mt-3">Create First Project</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map(project => (
                  <div key={project.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/projects/${project.id}`} className="font-medium hover:text-primary transition-colors">
                          {project.name}
                        </Link>
                        <Badge variant="outline" className={`text-2xs ${projectStatusColors[project.status]}`}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.description || 'No description'}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}`} className="flex items-center gap-2">
                            View <ArrowRight className="w-3 h-3" />
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/projects/${project.id}?edit=true`} className="flex items-center gap-2">
                            <Edit className="w-4 h-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteType({ type: 'project', id: project.id, name: project.name })}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {invoices.filter(i => i.status === 'OVERDUE').length} overdue, {formatCompactCurrency(outstanding)} outstanding
              </p>
              <Link href={`/invoices/new?client=${client.id}`}>
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Invoice
                </Button>
              </Link>
            </div>
            {invoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No invoices yet</p>
                <Link href={`/invoices/new?client=${client.id}`}>
                  <Button variant="outline" size="sm" className="mt-3">Create First Invoice</Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border bg-card divide-y">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/invoices/${invoice.id}`} className="font-medium hover:text-primary transition-colors">
                          {invoice.number}
                        </Link>
                        <Badge variant="outline" className={`text-2xs ${invoiceStatusColors[invoice.status]}`}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Due {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(invoice.total)}</p>
                      {invoice.paid < invoice.total && (
                        <p className="text-2xs text-muted-foreground">
                          {formatCurrency(invoice.total - invoice.paid)} due
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {invoice.status === 'DRAFT' && (
                        <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => handleSendInvoice(invoice.id)}>
                          <Send className="w-3 h-3" /> Send
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/invoices/${invoice.id}`} className="flex items-center gap-2">
                              View <ArrowRight className="w-3 h-3" />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/invoices/${invoice.id}?edit=true`} className="flex items-center gap-2">
                              <Edit className="w-4 h-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteType({ type: 'invoice', id: invoice.id, name: invoice.number })}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {activeProposals.length} pending proposal{activeProposals.length !== 1 ? 's' : ''}
              </p>
              <Link href={`/proposals/new?client=${client.id}`}>
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Proposal
                </Button>
              </Link>
            </div>
            {proposals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No proposals yet</p>
                <Link href={`/proposals/new?client=${client.id}`}>
                  <Button variant="outline" size="sm" className="mt-3">Create First Proposal</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {proposals.map(proposal => (
                  <div key={proposal.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/proposals/${proposal.id}`} className="font-medium hover:text-primary transition-colors">
                          {proposal.name}
                        </Link>
                        <Badge variant={proposal.status === 'ACCEPTED' ? 'success' : proposal.status === 'DECLINED' ? 'destructive' : 'secondary'} className="text-2xs">
                          {proposal.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(proposal.createdAt).toLocaleDateString()}
                        {proposal.viewedAt && ` · Viewed ${new Date(proposal.viewedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold">{formatCurrency(proposal.total)}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {proposal.status === 'DRAFT' && (
                        <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => handleSendProposal(proposal.id)}>
                          <Send className="w-3 h-3" /> Send
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/proposals/${proposal.id}`} className="flex items-center gap-2">
                              View <ArrowRight className="w-3 h-3" />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/proposals/${proposal.id}?edit=true`} className="flex items-center gap-2">
                              <Edit className="w-4 h-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteType({ type: 'proposal', id: proposal.id, name: proposal.name })}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {contracts.filter(c => c.status === 'SIGNED').length} signed contract{contracts.filter(c => c.status === 'SIGNED').length !== 1 ? 's' : ''}
              </p>
              <Link href={`/contracts/new?client=${client.id}`}>
                <Button size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  New Contract
                </Button>
              </Link>
            </div>
            {contracts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileSignature className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No contracts yet</p>
                <Link href={`/contracts/new?client=${client.id}`}>
                  <Button variant="outline" size="sm" className="mt-3">Create First Contract</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {contracts.map(contract => (
                  <div key={contract.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <FileSignature className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link href={`/contracts/${contract.id}`} className="font-medium hover:text-primary transition-colors">
                          {contract.name}
                        </Link>
                        <Badge variant={contract.status === 'SIGNED' ? 'success' : 'secondary'} className="text-2xs">
                          {contract.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {contract.signedAt ? `Signed ${new Date(contract.signedAt).toLocaleDateString()}` : 'Not signed'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold">{formatCurrency(contract.value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {payments.length} payment{payments.length !== 1 ? 's' : ''} received
              </p>
              <Link href={`/invoices/new?client=${client.id}`}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  Record Payment
                </Button>
              </Link>
            </div>
            {payments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No payments recorded yet</p>
              </div>
            ) : (
              <div className="rounded-lg border bg-card divide-y">
                {payments.map(payment => (
                  <div key={payment.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{payment.method.replace('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.reference && `${payment.reference} · `}
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(payment.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {data.messages.filter(m => m.clientId === clientId).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No messages yet</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowMessageDialog(true)}>
                  Add Message
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {data.messages.filter(m => m.clientId === clientId).map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromClient ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-xl ${
                        message.isFromClient
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-2xs mt-1 ${message.isFromClient ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                        {new Date(message.createdAt).toLocaleDateString()} {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onClose={() => setShowMessageDialog(false)} title="Add Message" description="Add a note to the client's conversation history.">
        <div className="space-y-4">
          <textarea
            className="w-full h-32 rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Type your message..."
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
            <Button onClick={handleAddMessage} disabled={!messageText.trim()}>Add Message</Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteType}
        onClose={() => setDeleteType(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleteType?.type}?`}
        description={`This will permanently delete "${deleteType?.name}". This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  )
}

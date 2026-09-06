import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================
// CLIENT HEALTH CALCULATION
// ============================================

export type ClientHealthStatus = 'healthy' | 'attention' | 'at-risk'

export interface ClientHealth {
  status: ClientHealthStatus
  score: number
  reasons: string[]
  lastActivity: Date | null
}

export interface ClientWithRelations {
  id: string
  status: string
  projects?: Array<{ status: string; endDate?: Date | string | null }>
  invoices?: Array<{ status: string; dueDate: Date | string; paid: number; total: number }>
  proposals?: Array<{ status: string; viewedAt?: Date | string | null; total: number }>
  contracts?: Array<{ status: string; signedAt?: Date | string | null }>
  payments?: Array<{ amount: number; date: Date | string }>
  activities?: Array<{ createdAt: Date | string }>
  messages?: Array<{ createdAt: Date | string; isFromClient: boolean }>
  createdAt: Date | string
  updatedAt: Date | string
}

export function calculateClientHealth(client: ClientWithRelations): ClientHealth {
  let score = 50
  const reasons: string[] = []
  let lastActivity: Date | null = null

  const updateLastActivity = (date: Date | string | null | undefined) => {
    if (!date) return
    const d = new Date(date)
    if (!lastActivity || d > lastActivity) {
      lastActivity = d
    }
  }

  const hasActiveProject = client.projects?.some(p => p.status === 'ACTIVE')
  if (hasActiveProject) {
    score += 15
    reasons.push('Active project in progress')
  }

  const clientMessages = client.messages?.filter(m => m.isFromClient) || []
  const lastClientMessage = clientMessages.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0]

  if (lastClientMessage) {
    updateLastActivity(lastClientMessage.createdAt)
    const daysSinceMessage = Math.floor(
      (Date.now() - new Date(lastClientMessage.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceMessage <= 7) {
      score += 20
      reasons.push('Recent client communication')
    } else if (daysSinceMessage <= 14) {
      score += 10
    } else if (daysSinceMessage <= 30) {
      score -= 5
      reasons.push(`No client reply for ${daysSinceMessage} days`)
    } else {
      score -= 15
      reasons.push(`No client reply for ${daysSinceMessage} days`)
    }
  }

  const overdueInvoices = client.invoices?.filter(inv => {
    if (inv.status === 'PAID') return false
    return new Date(inv.dueDate) < new Date()
  }) || []

  const paidInvoices = client.invoices?.filter(inv => inv.status === 'PAID') || []
  const pendingInvoices = client.invoices?.filter(inv => inv.status === 'DRAFT' || inv.status === 'SENT') || []

  if (overdueInvoices.length > 0) {
    score -= 30
    reasons.push(`${overdueInvoices.length} overdue invoice${overdueInvoices.length > 1 ? 's' : ''}`)
  } else if (pendingInvoices.length > 0 && paidInvoices.length > 0) {
    score += 10
    reasons.push('Invoices in progress')
  } else if (paidInvoices.length > 0) {
    score += 25
    reasons.push('All invoices paid on time')
  }

  const viewedProposals = client.proposals?.filter(p => p.viewedAt) || []
  if (viewedProposals.length > 0) {
    const lastViewed = viewedProposals.sort((a, b) =>
      new Date(b.viewedAt!).getTime() - new Date(a.viewedAt!).getTime()
    )[0]
    updateLastActivity(lastViewed.viewedAt)
    const daysSinceView = Math.floor(
      (Date.now() - new Date(lastViewed.viewedAt!).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSinceView <= 3) {
      score += 10
      reasons.push('Proposal viewed recently')
    }
  }

  const signedContracts = client.contracts?.filter(c => c.signedAt) || []
  if (signedContracts.length > 0) {
    score += 10
    const lastSigned = signedContracts.sort((a, b) =>
      new Date(b.signedAt!).getTime() - new Date(a.signedAt!).getTime()
    )[0]
    updateLastActivity(lastSigned.signedAt)
  }

  if (client.payments && client.payments.length > 0) {
    const lastPayment = client.payments.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0]
    updateLastActivity(lastPayment.date)
    const daysSincePayment = Math.floor(
      (Date.now() - new Date(lastPayment.date).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysSincePayment <= 14) {
      score += 10
      reasons.push('Recent payment received')
    }
  }

  if (client.activities && client.activities.length > 0) {
    const lastActivityEntry = client.activities.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
    if (!lastActivity || new Date(lastActivityEntry.createdAt) > lastActivity) {
      lastActivity = new Date(lastActivityEntry.createdAt)
    }
  }

  score = Math.max(0, Math.min(100, score))

  let status: ClientHealthStatus
  if (score >= 75) {
    status = 'healthy'
  } else if (score >= 45) {
    status = 'attention'
  } else {
    status = 'at-risk'
  }

  return { status, score, reasons, lastActivity }
}

export function getClientHealthLabel(status: ClientHealthStatus): string {
  switch (status) {
    case 'healthy': return 'Healthy'
    case 'attention': return 'Needs Attention'
    case 'at-risk': return 'At Risk'
  }
}

export function getClientHealthDescription(health: ClientHealth): string {
  if (health.reasons.length === 0) {
    return 'No activity recorded yet.'
  }
  return health.reasons.slice(0, 2).join(' • ')
}

// ============================================
// FINANCIAL HELPERS
// ============================================

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompactCurrency(amount: number, currency = 'USD'): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount, currency)
}

export function calculateOutstanding(invoices: Array<{ total: number; paid: number }>): number {
  return invoices.reduce((sum, inv) => sum + (inv.total - inv.paid), 0)
}

export function calculateProfit(invoices: Array<{ total: number; paid: number }>, expenses: number = 0): number {
  const revenue = invoices.filter(inv => inv.status === 'PAID' || inv.paid > 0).reduce((sum, inv) => sum + inv.paid, 0)
  return revenue - expenses
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return formatDate(date)
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = d.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0) return `In ${diffDays} days`
  return `${Math.abs(diffDays)} days ago`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

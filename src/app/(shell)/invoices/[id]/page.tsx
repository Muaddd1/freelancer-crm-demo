'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useData } from '@/lib/data-context'
import { useToast } from '@/lib/toast-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatCurrency, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  ArrowLeft, Send, Download, DollarSign, CheckCircle,
  ExternalLink, Printer
} from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/dialog'

const statusColors: Record<string, string> = {
  PAID: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  SENT: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  OVERDUE: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  DRAFT: 'bg-muted text-muted-foreground',
  VOID: 'bg-muted text-muted-foreground',
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const { data, isLoaded, sendInvoice, recordPayment } = useData()
  const { toast } = useToast()
  const [showPaymentDialog, setShowPaymentDialog] = React.useState(false)
  const [paymentAmount, setPaymentAmount] = React.useState('')
  const [paymentMethod, setPaymentMethod] = React.useState<'BANK_TRANSFER' | 'CARD' | 'PAYPAL' | 'CASH'>('BANK_TRANSFER')

  const invoiceId = params.id as string
  const invoice = data.invoices.find(i => i.id === invoiceId)
  const client = invoice ? data.clients.find(c => c.id === invoice.clientId) : null

  if (!isLoaded) return <div className="p-6">Loading...</div>
  if (!invoice) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-semibold">Invoice not found</h2>
        <Link href="/invoices"><Button variant="outline" className="mt-4 gap-2"><ArrowLeft className="w-4 h-4" />Back</Button></Link>
      </div>
    )
  }

  const project = invoice.projectId ? data.projects.find(p => p.id === invoice.projectId) : null
  const balance = invoice.total - invoice.paid
  const isOverdue = invoice.status === 'OVERDUE' || (invoice.status !== 'PAID' && new Date(invoice.dueDate) < new Date())

  const handleSend = () => {
    sendInvoice(invoiceId)
    toast({ type: 'success', title: 'Invoice sent', description: 'The invoice has been marked as sent.' })
  }

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentAmount)
    if (!amount || amount <= 0) {
      toast({ type: 'error', title: 'Invalid amount' })
      return
    }
    recordPayment(invoiceId, amount, paymentMethod)
    toast({ type: 'success', title: 'Payment recorded', description: `${formatCurrency(amount)} has been recorded.` })
    setShowPaymentDialog(false)
    setPaymentAmount('')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/invoices" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Invoices
            </Link>
            <span>/</span>
            <span className="text-foreground">{invoice.number}</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{invoice.number}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className={statusColors[invoice.status]}>{invoice.status}</Badge>
                {isOverdue && <span className="text-sm text-red-600 dark:text-red-400 font-medium">Overdue</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {invoice.status === 'DRAFT' && (
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSend}>
                  <Send className="w-4 h-4" /> Send
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-1.5">
                <Printer className="w-4 h-4" /> Print
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="w-4 h-4" /> Download
              </Button>
              {balance > 0 && (
                <Button size="sm" className="gap-1.5" onClick={() => setShowPaymentDialog(true)}>
                  <DollarSign className="w-4 h-4" /> Record Payment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {/* Invoice Details */}
          <div className="col-span-2 space-y-8">
            <div>
              <h3 className="text-sm font-semibold mb-3">Items</h3>
              <div className="rounded-lg border bg-card">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 border-b text-2xs font-medium text-muted-foreground uppercase">
                  <div className="col-span-8">Description</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-3 border-b last:border-0">
                    <div className="col-span-8 text-sm">{item.description}</div>
                    <div className="col-span-2 text-sm text-right">{item.quantity}</div>
                    <div className="col-span-2 text-sm text-right font-medium">{formatCurrency(item.amount)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Payment History</h3>
              {data.payments.filter(p => p.invoiceId === invoiceId).length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground border rounded-lg">
                  No payments recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {data.payments.filter(p => p.invoiceId === invoiceId).map(payment => (
                    <div key={payment.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                        <p className="text-2xs text-muted-foreground">
                          {payment.method.replace('_', ' ')} {payment.reference && `· ${payment.reference}`}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="font-semibold">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(invoice.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
                {invoice.paid > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Paid</span>
                    <span>-{formatCurrency(invoice.paid)}</span>
                  </div>
                )}
                {balance > 0 && (
                  <div className="flex justify-between font-semibold text-amber-600 dark:text-amber-400">
                    <span>Balance Due</span>
                    <span>{formatCurrency(balance)}</span>
                  </div>
                )}
              </div>
            </div>

            {client && (
              <div className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold mb-3">Bill To</h3>
                <Link href={`/clients/${client.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Avatar>
                    <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
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
                <span className="text-muted-foreground">Issue Date</span>
                <span>{new Date(invoice.issueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Due Date</span>
                <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </span>
              </div>
              {project && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project</span>
                  <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                    {project.name}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <ConfirmDialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onConfirm={handleRecordPayment}
        title="Record Payment"
        description={`Record a payment for ${formatCurrency(balance)} balance.`}
        confirmLabel="Record Payment"
        variant="default"
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-medium block mb-1">Amount</label>
            <Input
              type="number"
              placeholder={balance.toString()}
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
              max={balance}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Payment Method</label>
            <select
              className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as 'BANK_TRANSFER' | 'CARD' | 'PAYPAL' | 'CASH')}
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CARD">Card</option>
              <option value="PAYPAL">PayPal</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
        </div>
      </ConfirmDialog>
    </div>
  )
}

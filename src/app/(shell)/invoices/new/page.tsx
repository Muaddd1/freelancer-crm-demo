'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useData } from '@/lib/data-context'
import { useToast } from '@/lib/toast-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-4xl mx-auto"><Skeleton className="h-96 w-full" /></div>}>
      <NewInvoicePageInner />
    </Suspense>
  )
}

function NewInvoicePageInner() {
  const searchParams = useSearchParams()
  const { data, addInvoice } = useData()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    clientId: searchParams.get('client') || '',
    projectId: '',
    notes: '',
  })
  const [items, setItems] = React.useState([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
  ])

  const subtotal = items.reduce((s, i) => s + i.amount, 0)

  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: value }
      if (field === 'quantity' || field === 'rate') {
        updated.amount = updated.quantity * updated.rate
      }
      return updated
    }))
  }

  const addItem = () => {
    setItems(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), description: '', quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length === 1) return
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId) {
      toast({ type: 'error', title: 'Missing client', description: 'Please select a client.' })
      return
    }
    const validItems = items.filter(i => i.description && i.amount > 0)
    if (validItems.length === 0) {
      toast({ type: 'error', title: 'Missing items', description: 'Please add at least one line item.' })
      return
    }
    setLoading(true)
    addInvoice({
      clientId: form.clientId,
      projectId: form.projectId || null,
      status: 'DRAFT',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal,
      tax: 0,
      total: subtotal,
      paid: 0,
      notes: form.notes || null,
      items: validItems.map(({ id, description, quantity, rate, amount }) => ({ id, description, quantity, rate, amount })),
    })
    toast({ type: 'success', title: 'Invoice created' })
    setLoading(false)
    window.location.href = '/invoices'
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/invoices" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Invoices
      </Link>

      <h1 className="text-2xl font-bold mb-6">New Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium block mb-1.5">Client *</label>
            <select
              className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
              value={form.clientId}
              onChange={e => setForm({ ...form, clientId: e.target.value })}
              required
            >
              <option value="">Select a client...</option>
              {data.clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Project (optional)</label>
            <select
              className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
              value={form.projectId}
              onChange={e => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">No project</option>
              {data.projects.filter(p => p.clientId === form.clientId).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Line Items</h3>
          <div className="rounded-lg border bg-card">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 border-b text-2xs font-medium text-muted-foreground uppercase">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2">Amount</div>
            </div>
            {items.map(item => (
              <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b last:border-0 items-center">
                <div className="col-span-6">
                  <Input
                    placeholder="Service description"
                    value={item.description}
                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.rate}
                    onChange={e => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="h-9"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-sm font-medium flex-1">{formatCurrency(item.amount)}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(item.id)} className="p-1 hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-2">
            <Plus className="w-4 h-4" /> Add Line Item
          </button>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Notes</label>
          <textarea
            className="w-full h-20 rounded-lg border bg-background px-3 py-2 text-sm resize-none"
            placeholder="Payment terms, notes..."
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground text-lg">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex gap-3">
            <Link href="/invoices"><Button variant="outline" type="button">Cancel</Button></Link>
            <Button type="submit" loading={loading}>Create Invoice</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

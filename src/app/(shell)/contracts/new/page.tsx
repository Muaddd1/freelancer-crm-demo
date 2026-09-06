'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useData } from '@/lib/data-context'
import { useToast } from '@/lib/toast-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export default function NewContractPage() {
  const searchParams = useSearchParams()
  const { data, addContract } = useData()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    clientId: searchParams.get('client') || '',
    name: '',
    value: '',
    status: 'DRAFT' as const,
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId || !form.name || !form.value) {
      toast({ type: 'error', title: 'Missing required fields' })
      return
    }
    setLoading(true)
    addContract({
      clientId: form.clientId,
      projectId: null,
      name: form.name,
      status: form.status,
      value: parseFloat(form.value),
      signedAt: null,
      expiresAt: null,
      notes: form.notes || null,
    })
    toast({ type: 'success', title: 'Contract created' })
    setLoading(false)
    window.location.href = '/contracts'
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/contracts" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Contracts
      </Link>

      <h1 className="text-2xl font-bold mb-6">New Contract</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium block mb-1.5">Contract Name *</label>
          <Input placeholder="Development Agreement" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Client *</label>
          <select className="w-full h-10 rounded-lg border bg-background px-3 text-sm" value={form.clientId} onChange={e => setForm({ ...form, clientId: e.target.value })} required>
            <option value="">Select a client...</option>
            {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Contract Value *</label>
          <Input type="number" placeholder="10000" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Notes</label>
          <textarea className="w-full h-24 rounded-lg border bg-background px-3 py-2 text-sm resize-none" placeholder="Contract terms, notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/contracts"><Button variant="outline" type="button">Cancel</Button></Link>
          <Button type="submit" loading={loading}>Create Contract</Button>
        </div>
      </form>
    </div>
  )
}

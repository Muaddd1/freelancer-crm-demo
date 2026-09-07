'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useData } from '@/lib/data-context'
import { useToast } from '@/lib/toast-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'

export default function NewClientPage() {
  const router = useRouter()
  const { addClient } = useData()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    website: '',
    notes: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'LEAD',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      toast({ type: 'error', title: 'Missing required fields', description: 'Please enter a name and email.' })
      return
    }
    setLoading(true)
    const newClient = addClient({
      name: form.name,
      email: form.email,
      company: form.company || null,
      phone: form.phone || null,
      website: form.website || null,
      notes: form.notes || null,
      status: form.status,
    })
    toast({ type: 'success', title: 'Client created', description: `${form.name} has been added.` })
    setLoading(false)
    router.push(`/clients/${newClient.id}`)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/clients" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </Link>

      <h1 className="text-2xl font-bold mb-6">New Client</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Full Name *</label>
            <Input
              placeholder="Sarah Mitchell"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Email *</label>
            <Input
              type="email"
              placeholder="sarah@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Company</label>
            <Input
              placeholder="Acme Studio"
              value={form.company}
              onChange={e => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Phone</label>
            <Input
              type="tel"
              placeholder="+1 555-0123"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Website</label>
          <Input
            placeholder="acmestudio.com"
            value={form.website}
            onChange={e => setForm({ ...form, website: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Status</label>
          <select
            className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'LEAD' })}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="LEAD">Lead</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1.5">Notes</label>
          <textarea
            className="w-full h-24 rounded-lg border bg-background px-3 py-2 text-sm resize-none"
            placeholder="Additional notes about this client..."
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/clients">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" loading={loading}>Create Client</Button>
        </div>
      </form>
    </div>
  )
}

'use client'

import * as React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useData } from '@/lib/data-context'
import { useToast } from '@/lib/toast-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function NewProjectPage() {
  return (
    <Suspense fallback={<div className="p-6 max-w-2xl mx-auto"><Skeleton className="h-96 w-full" /></div>}>
      <NewProjectPageInner />
    </Suspense>
  )
}

function NewProjectPageInner() {
  const searchParams = useSearchParams()
  const { data, addProject } = useData()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    name: '',
    description: '',
    clientId: searchParams.get('client') || '',
    budget: '',
    deadline: '',
    status: 'PLANNING' as const,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.clientId) {
      toast({ type: 'error', title: 'Missing required fields', description: 'Please enter a project name and select a client.' })
      return
    }
    setLoading(true)
    addProject({
      name: form.name,
      description: form.description || null,
      clientId: form.clientId,
      budget: form.budget ? parseFloat(form.budget) : null,
      deadline: form.deadline || null,
      status: form.status,
    })
    toast({ type: 'success', title: 'Project created', description: `"${form.name}" has been created.` })
    setLoading(false)
    window.location.href = '/projects'
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <h1 className="text-2xl font-bold mb-6">New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Project Name *</label>
            <Input
              placeholder="Website Redesign"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

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
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Description</label>
            <textarea
              className="w-full h-24 rounded-lg border bg-background px-3 py-2 text-sm resize-none"
              placeholder="Project details..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Budget</label>
              <Input
                type="number"
                placeholder="5000"
                value={form.budget}
                onChange={e => setForm({ ...form, budget: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Deadline</label>
              <Input
                type="date"
                value={form.deadline}
                onChange={e => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Status</label>
            <select
              className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as any })}
            >
              <option value="PLANNING">Planning</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/projects">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" loading={loading}>Create Project</Button>
        </div>
      </form>
    </div>
  )
}

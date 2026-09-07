'use client'

import * as React from 'react'
import { useData } from '@/lib/data-context'
import { useToast } from '@/lib/toast-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  User, Bell, Globe,
  Download, Trash2, Check
} from 'lucide-react'

export default function SettingsPage() {
  const { data, isLoaded } = useData()
  const { toast } = useToast()
  const [saving, setSaving] = React.useState(false)

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      toast({ type: 'success', title: 'Settings saved' })
      setSaving(false)
    }, 500)
  }

  const handleExportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      ...data,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `freelancer-crm-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({ type: 'success', title: 'Data exported', description: 'Your data has been downloaded as a JSON file.' })
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.removeItem('freelancer-crm-data')
      toast({ type: 'success', title: 'Data cleared', description: 'Please refresh the page.' })
      window.location.reload()
    }
  }

  if (!isLoaded) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and application preferences.</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border bg-card">
        <div className="p-5 border-b flex items-center gap-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Profile</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Full Name</label>
              <Input defaultValue="Muad A." />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <Input defaultValue="muad@example.com" type="email" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Business Name</label>
            <Input defaultValue="Freelance Studio" />
          </div>
        </div>
      </div>

      {/* Business */}
      <div className="rounded-xl border bg-card">
        <div className="p-5 border-b flex items-center gap-3">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Business Details</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Currency</label>
              <select className="w-full h-10 rounded-lg border bg-background px-3 text-sm">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Timezone</label>
              <select className="w-full h-10 rounded-lg border bg-background px-3 text-sm">
                <option>America/New_York (EST)</option>
                <option>America/Los_Angeles (PST)</option>
                <option>Europe/London (GMT)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border bg-card">
        <div className="p-5 border-b flex items-center gap-3">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Invoice Reminders</p>
              <p className="text-xs text-muted-foreground">Get notified when invoices are overdue</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Proposal Views</p>
              <p className="text-xs text-muted-foreground">Get notified when clients view proposals</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Payment Received</p>
              <p className="text-xs text-muted-foreground">Get notified when payments are recorded</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="rounded-xl border bg-card">
        <div className="p-5 border-b flex items-center gap-3">
          <Download className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Data Management</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Export Data</p>
              <p className="text-xs text-muted-foreground">Download all your data as a JSON file</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportData}>
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-destructive">Clear All Data</p>
              <p className="text-xs text-muted-foreground">Permanently delete all clients, projects, invoices and more</p>
            </div>
            <Button variant="destructive" size="sm" className="gap-1.5" onClick={handleClearData}>
              <Trash2 className="w-4 h-4" /> Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-4">Account Statistics</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{data.clients.length}</p>
            <p className="text-xs text-muted-foreground">Clients</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{data.projects.length}</p>
            <p className="text-xs text-muted-foreground">Projects</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{data.invoices.length}</p>
            <p className="text-xs text-muted-foreground">Invoices</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} className="gap-1.5">
          {saving ? <Check className="w-4 h-4" /> : null}
          Save Settings
        </Button>
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useData } from '@/lib/utils'
import { useData as useDataCtx } from '@/lib/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCompactCurrency, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Plus, Search, Briefcase, ArrowRight, MoreHorizontal, Edit, Trash2, Eye, Clock } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/dialog'
import { useToast } from '@/lib/toast-context'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const statusColors: Record<string, string> = {
  PLANNING: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  ON_HOLD: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  COMPLETED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-muted text-muted-foreground',
}

export default function ProjectsPage() {
  const { data, isLoaded, deleteProject } = useDataCtx()
  const { toast } = useToast()
  const [search, setSearch] = React.useState('')
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const filtered = React.useMemo(() => {
    let result = [...data.projects]
    if (search) {
      const s = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(s) ||
        data.clients.find(c => c.id === p.clientId)?.name.toLowerCase().includes(s)
      )
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [data.projects, data.clients, search])

  const handleDelete = () => {
    if (!deleteId) return
    deleteProject(deleteId)
    toast({ type: 'success', title: 'Project deleted' })
    setDeleteId(null)
  }

  if (!isLoaded) {
    return (
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your client projects and track progress.
          </p>
        </div>
        <Link href="/projects/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-3" />
          <h3 className="font-semibold">No projects found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? 'Try a different search.' : 'Create your first project to get started.'}
          </p>
          {!search && (
            <Link href="/projects/new" className="mt-4">
              <Button size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(project => {
            const client = data.clients.find(c => c.id === project.clientId)
            return (
              <div key={project.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/projects/${project.id}`} className="font-medium hover:text-primary transition-colors">
                      {project.name}
                    </Link>
                    <Badge variant="outline" className={`text-2xs ${statusColors[project.status]}`}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    {client && (
                      <>
                        <Avatar className="w-4 h-4">
                          <AvatarFallback className="text-2xs">{getInitials(client.name)}</AvatarFallback>
                        </Avatar>
                        <span>{client.name}</span>
                      </>
                    )}
                    {project.deadline && (
                      <>
                        <span>·</span>
                        <Clock className="w-3 h-3" />
                        <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {project.budget && (
                    <p className="text-sm font-semibold">{formatCompactCurrency(project.budget)}</p>
                  )}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/projects/${project.id}`} className="flex items-center gap-2">
                          <Eye className="w-4 h-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/projects/${project.id}?edit=true`} className="flex items-center gap-2">
                          <Edit className="w-4 h-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(project.id)}>
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete project?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  )
}

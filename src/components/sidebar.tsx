'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, Briefcase, FileText, Receipt, FileSignature,
  Settings, ChevronLeft, ChevronRight, Zap, Search, Sun, Moon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const STORAGE_KEY = 'freelancer-crm-theme'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/invoices', label: 'Invoices', icon: Receipt },
  { href: '/proposals', label: 'Proposals', icon: FileText },
  { href: '/contracts', label: 'Contracts', icon: FileSignature },
]

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newDarkMode = !prev
      document.documentElement.classList.toggle('dark', newDarkMode)
      try {
        localStorage.setItem(STORAGE_KEY, newDarkMode ? 'dark' : 'light')
      } catch {}
      return newDarkMode
    })
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-card border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight">Freelancer CRM</span>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 h-9 bg-muted/50 border-0 text-sm"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-2xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary')} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 py-2 border-t space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </div>

      {/* User + Dark Mode */}
      <div className="px-3 py-3 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              MO
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Muad A.</p>
              <p className="text-2xs text-muted-foreground truncate">Pro Plan</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border shadow-sm"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>
    </aside>
  )
}

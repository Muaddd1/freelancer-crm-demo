import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'bg-destructive text-destructive-foreground': variant === 'destructive',
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20': variant === 'success',
          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20': variant === 'warning',
          'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20': variant === 'info',
          'border border-border text-foreground': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }

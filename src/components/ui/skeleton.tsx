'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  )
}

export function MetricSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-lg border p-4 space-y-2', className)}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-24" />
    </div>
  )
}

export function ClientCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('rounded-xl border p-5 space-y-4', className)}>
      <div className="flex items-start gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-4 pt-3 border-t">
        <div className="space-y-1">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  )
}

export function TimelineSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5 pt-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  )
}

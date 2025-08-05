"use client"

import React from 'react'

/**
 * Loading fallback component for Suspense
 */
export function LoadingFallback() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-300 rounded" />
            <div className="h-6 w-8 bg-gray-300 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-gray-300 rounded" />
            <div className="h-6 w-8 bg-gray-300 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="h-4 w-12 bg-gray-300 rounded mb-1" />
            <div className="h-6 w-20 bg-gray-300 rounded" />
          </div>
          <div className="h-8 w-20 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="h-6 w-32 bg-gray-300 rounded" />
        </div>
        <div className="divide-y">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-300 rounded" />
                <div>
                  <div className="h-5 w-32 bg-gray-300 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 w-16 bg-gray-300 rounded" />
                <div className="h-8 w-8 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
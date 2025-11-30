"use client"

import React from "react"

interface AppHeaderProps {
  logo?: React.ReactNode
  currentUserName?: string
  onLogout?: () => void
  height: number
}

export function AppHeaderComponent({
  logo,
  currentUserName,
  onLogout,
  height,
}: AppHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-6"
      style={{ height: `${height}px` }}
    >
      <div className="flex items-center gap-2">
        {logo ?? <span className="font-semibold">FactoryGate</span>}
      </div>
      <div className="flex items-center gap-4">
        {currentUserName && (
          <span className="text-sm text-gray-600">Ciao, {currentUserName}</span>
        )}
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  )
}
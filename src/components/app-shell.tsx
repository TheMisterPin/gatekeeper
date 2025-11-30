"use client"

import { NavItem } from "@/types/components/nav-item"
import React from "react"
import { AppHeaderComponent } from "./app-header"
export interface AppShellProps {
  logo?: React.ReactNode
  currentUserName?: string
  onLogout?: () => void
  navItems?: NavItem[]
  onNavItemClick?: (id: string) => void
  children?: React.ReactNode
}

export default function AppShell({
  currentUserName,
  onLogout,
  navItems = [],
  onNavItemClick,
  logo,
  children,
}: AppShellProps) {
  // Authenticated - show full app layout
  const headerHeight = 64 // px
  const footerHeight = 56 // px




  return (
    <div className="min-h-screen flex flex-col">
      <AppHeaderComponent
        logo={logo}
        currentUserName={currentUserName}
        onLogout={onLogout}
        height={headerHeight}
      />

      {/* Main content area */}
      <div
        className="flex"
        style={{
          marginTop: `${headerHeight}px`,
          marginBottom: `${footerHeight}px`,
          height: `calc(100vh - ${headerHeight}px - ${footerHeight}px)`,
        }}
      >
        {/* Main content (left side) */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
        {/* Navigation sidebar (right side) */}

      </div>

      {/* Footer */}

    </div>
  )
}

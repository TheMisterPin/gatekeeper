"use client"

import { NavItem } from "@/types/components/nav-item"
import React, { useCallback, useState } from "react"
import { AppHeaderComponent } from "./app-header"
import AppFooter from "./layout-elements/app-footer"
import SimpleSidebar from "./layout-elements/simple-sidebar"
export interface AppShellProps {
  logo?: React.ReactNode
  currentUserName?: string
  onLogout?: () => void
  navItems?: NavItem[]
  onNavItemClick?: (id: string) => void
  children?: React.ReactNode
}

/**
 * Struttura principale autenticata che unisce intestazione, sidebar e contenuto.
 * Gestisce l'apertura della barra laterale e mantiene spazio per header e footer fissi.
 */
export default function AppShell({
  currentUserName,
  onLogout,
  logo,
  children,
}: AppShellProps) {
  const headerHeight = 64
  const footerHeight = 56

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((s) => !s)
  }, [])




  return (
    <div className="min-h-screen flex flex-col w-full">
      <AppHeaderComponent logo={logo} onToggleSidebar={toggleSidebar} />
      <div
        className={`flex relative ${sidebarOpen ? "overflow-hidden" : ""}`}
        style={{
          marginTop: `${headerHeight}px`,
          marginBottom: `${footerHeight}px`,
          height: `calc(100vh - ${headerHeight}px - ${footerHeight}px)`,
        }}
      >
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
        <SimpleSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <AppFooter currentUserName={currentUserName} onLogout={onLogout} footerHeight={footerHeight} />
    </div>
  )
}

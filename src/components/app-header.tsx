"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { PanelLeftIcon } from "lucide-react"

interface AppHeaderProps {
  logo?: React.ReactNode
  onToggleSidebar?: () => void
}

/**
 * Barra di intestazione principale con logo e controllo per aprire la sidebar.
 * Espone un pulsante opzionale per la navigazione mobile e mostra l'elemento del logo passato dal layout.
 */
export function AppHeaderComponent({
  logo,
  onToggleSidebar,
}: AppHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 bg-topbanner border-b border-gray-200 flex items-center justify-between px-6 h-16"
     
    >
      <div className="flex items-center gap-2">

        {logo}
      </div>

      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <PanelLeftIcon />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
      </div>
    </header>
  )
}
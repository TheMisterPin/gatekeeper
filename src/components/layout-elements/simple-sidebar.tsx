"use client"


import { generateMockAppointments } from "@/lib/mocks/appointments"
import { Home, Inbox, Calendar, Search, Settings, Delete, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { ConfirmModal } from "../modals/confirm-modal"
import { ConfirmModalComponent } from "../modals/modal-trigger"

const items = [
  { title: "Generate Appointments", icon: Home, onclick: () => postAppointments() },
  { title: "Inbox", icon: Inbox, href: "#" },
  { title: "Calendar", icon: Calendar, href: "#" },
  { title: "Search", icon: Search, href: "#" },
  { title: "Settings", icon: Settings, href: "#" },
]

/**
 * Invoca la generazione di appuntamenti fittizi e li invia all'API.
 */
function postAppointments() {
  (async () => {
    try {
      const appointments = await generateMockAppointments(10);
      for (const appointment of appointments) {
        try {
          const res = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointment),
          });

          if (!res.ok) {
            const body = await res.json().catch(() => null);
            // eslint-disable-next-line no-console
            console.error('POST /api/appointments failed', res.status, body);
          } else {
            // eslint-disable-next-line no-console
            console.log('Created appointment', await res.json());
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Network error posting appointment', err);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error generating appointments', err);
    }
  })();
}

function deleteAppointments() {
  (async () => {
    try {
   
          const res = await fetch('/api/dev/appointments', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!res.ok) {
            const body = await res.json().catch(() => null);
            // eslint-disable-next-line no-console
            console.error('POST /api/appointments failed', res.status, body);
          } else {
            // eslint-disable-next-line no-console
            console.log('Created appointment', await res.json());
          
      }
      }
     catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error generating appointments', err);
    }
  })();
}
export default function SimpleSidebar({
  open = true,
  onClose,
}: {
  open?: boolean
  onClose?: () => void
}) {
  /**
   * Gestisce il rendering della sidebar animata e chiama onClose quando si clicca sull'overlay.
   */
  const [rendered, setRendered] = useState(open)
  const [active, setActive] = useState(open)

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRendered(true)
      requestAnimationFrame(() => setActive(true))
      return
    }

    setActive(false)
    const t = window.setTimeout(() => setRendered(false), 400)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!rendered) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [rendered])

  if (!rendered) return null

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {/* overlay - clicking closes; overlay does not blur page */}
      <div
        className={
          "absolute inset-0 bg-black/40 transition-opacity duration-400 " +
          (active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        onClick={() => onClose?.()}
      />

      {/* panel - slides in from right; clicking inside shouldn't close */}
      <aside
        className={
          "absolute right-0 top-0 h-full w-64 transform bg-sidebar text-sidebar-foreground border-l border-sidebar-border p-4 overflow-y-auto transition-transform duration-400 ease-in-out " +
          (active ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none")
        }
        onClick={(e) => e.stopPropagation()}
      >
              <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
     onClick={() => postAppointments()}>Generate Appointments</button>
      <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={() => deleteAppointments()}>Delete Appointments</button>
      <ConfirmModalComponent triggerText="Apri" modalToOpen="confirm" icon={Download} message="DIO CAN"/>
        <nav className="flex flex-col gap-2">
          {items.map((it) => (
            <a
              key={it.title}
              href={it.href}
            >
              <it.icon className="size-4" />
              <span>{it.title}</span>
            </a>
          ))}
        </nav>
      </aside>
    </div>
  )
}

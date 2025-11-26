"use client"

import { prisma } from "@/lib/prisma"
import { NavItem } from "@/types/components/nav-item"
import { LoginFormValues } from "@/types/login/login-form-values"
import { getRandomDate } from "@/utils/get-random-date"
import type React from "react"

import { useState } from "react"


const resources = await prisma.ePS_Resource.findMany()
const visitor = await prisma.rEM_Contact.findMany({where: {TypeID: 3}})
const getRandomResource = () => {
    const randomIndex = Math.floor(Math.random() * resources.length);
    return resources[randomIndex];
}
const getRandomVisitor = () => {
    const randomIndex = Math.floor(Math.random() * visitor.length);
    return visitor[randomIndex];
}
const start = new Date("2025-11-26T00:00:00");
const end   = new Date("2025-11-30T23:59:59");

const createNewAppointment = () => {
    const randomDate = getRandomDate(start, end);
    const resource = getRandomResource();
    const visitor = getRandomVisitor();
    const newAppointment = {
        Location: resource.CustString2 ?? "Ufficio Centrale",
        VisitorName: visitor.Name ?? "Visitatore Sconosciuto",
        HostId : resource.ResourceID,
        VisitorId: visitor.ID,
        StartTime: randomDate
}    
return prisma.vIS_VisitAppointment.create({ data: newAppointment });}
async function handleClick(){
  for (let i = 0; i < 20; i++) {
    await createNewAppointment();
}
}
export interface AppShellProps {
  logo?: React.ReactNode
  isAuthenticated: boolean
  currentUserName?: string
  onLogout?: () => void
  navItems?: NavItem[]
  onNavItemClick?: (id: string) => void
  onLoginSubmit?: (values: LoginFormValues) => void
  loginSubmitting?: boolean
  children?: React.ReactNode
}

export default function AppShell({
  logo,
  isAuthenticated,
  currentUserName,
  onLogout,
  navItems = [],
  onNavItemClick,
  onLoginSubmit,
  loginSubmitting = false,
  children,
}: AppShellProps) {
  const [serverIp, setServerIp] = useState("")
  const [resourceName, setResourceName] = useState("")
  const [deviceName, setDeviceName] = useState("")

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onLoginSubmit) {
      onLoginSubmit({ serverIp, resourceName, deviceName })
    }
  }

  // Not authenticated - show login view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Accesso dispositivo</h1>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="serverIp" className="block text-sm font-medium text-gray-700 mb-1">
                Server IP address
              </label>
              <input
                type="text"
                id="serverIp"
                value={serverIp}
                onChange={(e) => setServerIp(e.target.value)}
                disabled={loginSubmitting}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="resourceName" className="block text-sm font-medium text-gray-700 mb-1">
                Resource name
              </label>
              <input
                type="text"
                id="resourceName"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                disabled={loginSubmitting}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 mb-1">
                Device name
              </label>
              <input
                type="text"
                id="deviceName"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                disabled={loginSubmitting}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loginSubmitting ? "Connecting…" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Authenticated - show full app layout
  const headerHeight = 64 // px
  const footerHeight = 56 // px




  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 flex items-center justify-between px-6"
        style={{ height: `${headerHeight}px` }}
      >
        <div className="flex items-center">{logo}</div>
<button onClick={handleClick}>
          Logout
        </button>
      </header>

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
        <aside className="w-60 bg-white border-l border-gray-200 overflow-y-auto">
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavItemClick?.(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-left transition-colors ${
                      item.isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      {/* Footer */}
      <footer
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-between px-6"
        style={{ height: `${footerHeight}px` }}
      >
        <div className="text-sm text-gray-600">Visitor Control System</div>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          {currentUserName || "Logout"}
        </button>
      </footer>
    </div>
  )
}

"use client"

import type { AppointmentsMainViewProps, Appointment, AppointmentStatus } from "@/types/appointments"
import SectionHeader from "./layout-elements/section-header"
import { Search } from "lucide-react"
import { useState } from "react"

// Helper to format time from ISO string or extract HH:MM
function formatTime(timeString: string): string {
  if (timeString.includes("T")) {
    // ISO format
    const date = new Date(timeString)
    return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
  }
  // Assume it's already formatted or extract first 5 chars
  return timeString.slice(0, 5)
}

// Status labels in Italian
const statusLabels: Record<AppointmentStatus, string> = {
  SCHEDULED: "Programmato",
  CHECKED_IN: "In corso",
  COMPLETED: "Completato",
  CANCELLED: "Annullato",
  NO_SHOW: "No show"
}

// Status colors
const statusColors: Record<AppointmentStatus, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  CHECKED_IN: "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-orange-100 text-orange-700",
}

export default function AppointmentsMainView({
  employees,
  appointments: appointmentsProp = [],
  searchTerm,
  selectedEmployeeId,
  onSearchTermChange,
  onEmployeeFilterChange,
  onAppointmentClick,
  loading = false,
  error = null,
  availableDates = [],
}: AppointmentsMainViewProps) {
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null)
  const [localEmployeeFilter, setLocalEmployeeFilter] = useState<string | null>(null)

  const isEmployeeFilterControlled = typeof selectedEmployeeId !== "undefined"
  const effectiveEmployeeFilter = (isEmployeeFilterControlled ? selectedEmployeeId : localEmployeeFilter) ?? null

  const handleEmployeeFilterChange = (value: string | null) => {
    onEmployeeFilterChange?.(value)
    if (!isEmployeeFilterControlled) {
      setLocalEmployeeFilter(value)
    }
  }

  const filteredAppointments = appointmentsProp.filter((appointment) => {
    if (searchTerm && !appointment.visitorName.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (effectiveEmployeeFilter && String(appointment.hostId) !== String(effectiveEmployeeFilter)) return false
    if (selectedDateFilter && appointment.date !== selectedDateFilter) return false
    return true
  })

  const appointmentsByHost = filteredAppointments.reduce(
    (acc, appointment) => {
      const hostKey = String(appointment.hostId)
      if (!acc[hostKey]) {
        acc[hostKey] = {
          hostId: hostKey,
          hostName: appointment.hostName,
          appointments: [] as Appointment[],
        }
      }
      acc[hostKey].appointments.push(appointment)
      return acc
    },
    {} as Record<string, { hostId: string; hostName: string; appointments: Appointment[] }>,
  )

  Object.values(appointmentsByHost).forEach((group) => {
    group.appointments.sort((a, b) => {
      const timeA = new Date((a.startTime ?? a.expectedAt) ?? 0).getTime()
      const timeB = new Date((b.startTime ?? b.expectedAt) ?? 0).getTime()
      return timeA - timeB
    })
  })

  const normalizedEmployees = employees.map((employee) => ({
    id: String(employee.id),
    fullName: employee.fullName || String(employee.id),
  }))

  const fallbackHostOptions = Array.from(
    appointmentsProp.reduce((acc, appointment) => {
      const hostKey = String(appointment.hostId)
      if (!acc.has(hostKey)) {
        acc.set(hostKey, appointment.hostName)
      }
      return acc
    }, new Map<string, string>()),
  ).map(([id, name]) => ({ id, fullName: name }))

  const hostOptions = normalizedEmployees.length > 0 ? normalizedEmployees : fallbackHostOptions
  const derivedDates = Array.from(new Set(appointmentsProp.map((a) => a.date))).filter(Boolean)
  const sourceDateOptions = availableDates.length ? availableDates : derivedDates
  const dateOptions = [...sourceDateOptions].sort()

  return (
    <div className="flex h-full flex-col border-2 border-blue-500 rounded-md overflow-hidden bg-white">
      <div className="sticky top-0 z-10 space-y-4 border-b border-blue-200 bg-white/95 backdrop-blur p-4 shadow-sm">
        {loading && <div className="text-sm text-gray-600">Caricamento appuntamenti…</div>}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">Errore caricamento: {error}</div>
        )}
        <SectionHeader title="Appuntamenti di oggi" />

        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cerca per nome visitatore..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="w-64">
            <select
              value={effectiveEmployeeFilter ?? ""}
              onChange={(e) => handleEmployeeFilterChange(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tutti gli host</option>
              {hostOptions.map((host) => (
                <option key={host.id} value={host.id}>
                  {host.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="w-48">
            <select
              value={selectedDateFilter ?? ""}
              onChange={(e) => setSelectedDateFilter(e.target.value || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tutte le date</option>
              {dateOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
        {(!loading && filteredAppointments.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nessun appuntamento per oggi</h3>
            <p className="text-gray-600">Controlla più tardi o verifica i filtri applicati.</p>
          </div>
        ) : (
          <div className="space-y-8 p-4 pb-6">
            {Object.values(appointmentsByHost).map((group) => {
              const employeeDetails = employees.find((emp) => String(emp.id) === group.hostId)
              return (
                <div key={group.hostId} className="space-y-3">
                  <div className="border-b border-gray-200 pb-2">
                    <h2 className="text-lg font-semibold text-gray-900">{group.hostName}</h2>
                    {employeeDetails && (employeeDetails.department || employeeDetails.location) && (
                      <p className="text-sm text-gray-600">
                        {[employeeDetails.department, employeeDetails.location].filter(Boolean).join(" • ")}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    {group.appointments.map((appointment) => (
                      <button
                        key={appointment.id}
                        onClick={() => onAppointmentClick?.(appointment)}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all text-left w-full"
                      >
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 text-center">
                            <div className="text-2xl font-semibold text-gray-900">
                              {formatTime(appointment.expectedAt)}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{appointment.visitorName}</h3>
                                {appointment.visitorCompany && (
                                  <p className="text-sm text-gray-600 mt-0.5">{appointment.visitorCompany}</p>
                                )}
                              </div>

                              <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                                {statusLabels[appointment.status]}
                              </span>
                            </div>

                            {appointment.purpose && <p className="text-sm text-gray-700 mt-2">{appointment.purpose}</p>}
                            {appointment.location && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                  {appointment.location}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

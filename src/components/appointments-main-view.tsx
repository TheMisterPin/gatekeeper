"use client"

import type { AppointmentsMainViewProps, Appointment, AppointmentStatus } from "@/types/appointments"

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
  appointments,
  searchTerm,
  selectedEmployeeId,
  onSearchTermChange,
  onEmployeeFilterChange,
  onAppointmentClick,
}: AppointmentsMainViewProps) {
  // Group appointments by hostId
  const appointmentsByHost = appointments.reduce(
    (acc, appointment) => {
      const hostKey = String(appointment.hostId)
      if (!acc[hostKey]) {
        acc[hostKey] = {
          hostId: hostKey,
          hostName: appointment.hostName,
          appointments: [],
        }
      }
      acc[hostKey].appointments.push(appointment)
      return acc
    },
    {} as Record<string, { hostId: string; hostName: string; appointments: Appointment[] }>,
  )

  // Sort appointments within each host group by expectedAt
  Object.values(appointmentsByHost).forEach((group) => {
    group.appointments.sort((a, b) => {
      const timeA = new Date((a.startTime ?? a.expectedAt) ?? 0).getTime()
      const timeB = new Date((b.startTime ?? b.expectedAt) ?? 0).getTime()
      return timeA - timeB
    })
  })

  const hostGroups = Object.values(appointmentsByHost)

  // Find employee details for host
  const getEmployeeDetails = (hostId: string) => {
    return employees.find((emp) => emp.id === hostId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Appuntamenti di oggi</h1>
        <p className="text-sm text-gray-600 mt-1">Oggi</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search input */}
        <div className="flex-1 min-w-60">
          <input
            type="text"
            placeholder="Cerca per nome visitatore..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange?.(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Employee filter dropdown */}
        <div className="w-64">
          <select
            value={selectedEmployeeId || ""}
            onChange={(e) => onEmployeeFilterChange?.(e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tutti i dipendenti</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.fullName}
                {employee.department && ` - ${employee.department}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments list */}
      {appointments.length === 0 ? (
        // Empty state
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nessun appuntamento per oggi</h3>
          <p className="text-gray-600">Controlla più tardi o verifica i filtri applicati.</p>
        </div>
      ) : (
        // Grouped appointments
        <div className="space-y-8">
          {hostGroups.map((group) => {
            const employeeDetails = getEmployeeDetails(group.hostId)

            return (
              <div key={group.hostId} className="space-y-3">
                {/* Host group header */}
                <div className="border-b border-gray-200 pb-2">
                  <h2 className="text-lg font-semibold text-gray-900">{group.hostName}</h2>
                  {employeeDetails && (employeeDetails.department || employeeDetails.location) && (
                    <p className="text-sm text-gray-600">
                      {[employeeDetails.department, employeeDetails.location].filter(Boolean).join(" • ")}
                    </p>
                  )}
                </div>

                {/* Appointments for this host */}
                <div className="grid gap-3">
                  {group.appointments.map((appointment) => (
                    <button
                      key={appointment.id}
                      onClick={() => onAppointmentClick?.(String(appointment.id))}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all text-left w-full"
                    >
                      <div className="flex items-start gap-4">
                        {/* Time */}
                        <div className="shrink-0 text-center">
                          <div className="text-2xl font-semibold text-gray-900">
                            {formatTime(appointment.startTime ?? appointment.expectedAt)}
                          </div>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{appointment.visitorName}</h3>
                              {appointment.visitorCompany && (
                                <p className="text-sm text-gray-600 mt-0.5">{appointment.visitorCompany}</p>
                              )}
                            </div>

                            {/* Status pill */}
                            <span
                              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}
                            >
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
  )
}

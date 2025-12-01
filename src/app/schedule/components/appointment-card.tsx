"use client"

import type { Appointment, AppointmentStatus } from "@/types/appointments"

interface AppointmentCardProps {
  appointment: Appointment
  onClick?: (appointment: Appointment) => void
}

const statusLabels: Record<AppointmentStatus, string> = {
  SCHEDULED: "Programmato",
  CHECKED_IN: "In corso",
  COMPLETED: "Completato",
  CANCELLED: "Annullato",
  NO_SHOW: "No show",
}

const statusColors: Record<AppointmentStatus, string> = {
  SCHEDULED: "bg-blue-100 text-blue-700",
  CHECKED_IN: "bg-green-100 text-green-700",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-orange-100 text-orange-700",
}

function formatTime(timeString: string): string {
  if (timeString.includes("T")) {
    const date = new Date(timeString)
    return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
  }
  return timeString.slice(0, 5)
}

export default function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const handleClick = () => {
    onClick?.(appointment)
  }

  return (
    <button
      onClick={handleClick}
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
  )
}

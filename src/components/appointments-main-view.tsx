"use client"

import type { AppointmentsMainViewProps } from "@/types/appointments"
import SectionHeader from "./layout-elements/section-header"
import AppointmentCard from "@/app/schedule/components/appointment-card"
import ScheduleToolbar from "@/app/schedule/components/schedule-toolbar"
import GroupHeader from "@/app/schedule/components/group-header"
import NoAppointments from "@/app/schedule/components/no-appointments"

export default function AppointmentsMainView({
  searchTerm,
  selectedDateFilter,
  hostOptions,
  dateOptions,
  groupedAppointments,
  onSearchTermChange,
  onEmployeeFilterChange,
  onAppointmentClick,
  loading = false,
  error = null,
}: AppointmentsMainViewProps) {

  return (
    <div className="flex h-full flex-col border-2 border-blue-500 rounded-md overflow-hidden bg-white">
      <div className="sticky top-0 z-10 space-y-4 border-b border-blue-200 bg-white/95 backdrop-blur p-4 shadow-sm">
        {loading && <div className="text-sm text-gray-600">Caricamento appuntamenti…</div>}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">Errore caricamento: {error}</div>
        )}
        <SectionHeader title="Appuntamenti di oggi" />

<ScheduleToolbar
          searchTerm={searchTerm}
          selectedDateFilter={selectedDateFilter}
          hostOptions={hostOptions}
          dateOptions={dateOptions}
          onSearchTermChange={onSearchTermChange}
          setSelectedDateFilter={() => {}}
          handleEmployeeFilterChange={onEmployeeFilterChange ?? (() => {})}
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
        {(!loading && groupedAppointments.length === 0) ? (
          <NoAppointments />
        ) : (
          <div className="space-y-8 p-4 pb-6">
            {groupedAppointments.map((group) => (
              <div key={group.hostId} className="space-y-3">
                <GroupHeader group={group} />

                <div className="grid gap-3">
                  {group.appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onClick={onAppointmentClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import type { AppointmentsMainViewProps } from "@/types/appointments"
import SectionHeader from "./layout-elements/section-header"
import AppointmentCard from "@/app/schedule/components/appointment-card"
import ScheduleToolbar from "@/app/schedule/components/schedule-toolbar"
import GroupHeader from "@/app/schedule/components/group-header"
import NoAppointments from "@/app/schedule/components/no-appointments"
import { Download, RefreshCcw } from "lucide-react"
import { exportAppointments } from "@/utils/export-appointments"
import { useScheduleController } from "@/hooks/useScheduleController"


export default function AppointmentsMainView({
  searchTerm,
  selectedEmployeeId,
  selectedDateFilter,
  hostOptions,
  dateOptions,
  groupedAppointments,
  onSearchTermChange,
  onEmployeeFilterChange,
  onDateFilterChange,
  onAppointmentClick,
  loading = true,
}: AppointmentsMainViewProps) {
const {refresh} = useScheduleController();
const exportActionButton = {
    icon: Download,
    tooltip: "Export appointments",
    actionPerformed: () => exportAppointments(groupedAppointments.flatMap(group => group.appointments))
}
const refreshActionButton = {
    icon: RefreshCcw,
    tooltip: "Refresh appointments",
    actionPerformed: () => refresh()
}
const titleActions = [exportActionButton, refreshActionButton]

  return (
    <div className="flex h-full flex-col border-2 border-transparent  rounded-md overflow-hidden">
      <div className="sticky top-0 z-10 space-y-4 border-b  bg-gray-200/50 backdrop-blur p-4 shadow-sm">
        {loading && <div className="text-sm text-gray-600">Caricamento appuntamenti…</div>}
        <SectionHeader title="Appuntamenti di oggi" headerActions={titleActions} />

        <ScheduleToolbar
          searchTerm={searchTerm}
          selectedDateFilter={selectedDateFilter}
          hostOptions={hostOptions}
          dateOptions={dateOptions}
          onSearchTermChange={onSearchTermChange}
          setSelectedDateFilter={onDateFilterChange ?? (() => {})}
          effectiveEmployeeFilter={selectedEmployeeId}
          handleEmployeeFilterChange={onEmployeeFilterChange ?? (() => {})}
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide ">
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

import type { Meta, StoryObj } from "@storybook/react"
import AppShell from "@/components/app-shell"
import AppointmentsMainView from "@/components/appointments-main-view"
import ArrivalCheckInModal from "@/components/arrival-check-in-modal"
import { HeaderLogo } from "@/components/layout-elements/header-logo"

const meta: Meta = {
  title: "Pages/Schedule",
  parameters: { layout: "fullscreen" },
}

export default meta

const sampleAppointments = [
  {
    id: 1,
    visitorName: "Cliente Demo",
    visitorCompany: "Demo SpA",
    hostId: "1",
    hostName: "Mario Rossi",
    status: "SCHEDULED" as const,
    expectedAt: "2025-11-25T09:00:00Z",
    startTime: "2025-11-25T09:00:00Z",
    date: "2025-11-25",
  },
]

const groupedAppointments = [
  {
    hostId: "1",
    hostName: "Mario Rossi",
    department: "Vendite",
    appointments: sampleAppointments,
  },
]

export const Default: StoryObj = {
  render: () => (
    <AppShell logo={<HeaderLogo />} currentUserName="Mario Rossi">
      <AppointmentsMainView
        searchTerm=""
        selectedEmployeeId={null}
        selectedDateFilter={null}
        hostOptions={[{ id: "1", fullName: "Mario Rossi" }]}
        dateOptions={["2025-11-25"]}
        groupedAppointments={groupedAppointments}
      />
      <ArrivalCheckInModal
        open
        onClose={() => {}}
        appointment={{
          id: "1",
          visitorName: "Cliente Demo",
          hostName: "Mario Rossi",
          scheduledTime: "09:00",
        }}
        mainConsentChecked
        biometricConsentChecked
        isCameraActive={false}
        onCameraToggle={() => {}}
        onCapturePhoto={() => {}}
        onConfirmCheckIn={() => {}}
        onDownloadBadge={() => {}}
        todayLabel="25/11/2025"
      />
    </AppShell>
  ),
}

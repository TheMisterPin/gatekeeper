import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import type { Appointment, Employee } from "@/types/appointments"
import AppointmentsMainView from "./appointments-main-view"

const employees: Employee[] = [
  { id: "E001", fullName: "Marco Bianchi", department: "Operations", location: "Stabilimento A" },
  { id: "E002", fullName: "Laura Rossi", department: "Qualità", location: "Stabilimento B" },
  { id: "E003", fullName: "Giulia Verdi", department: "Produzione", location: "Stabilimento A" },
]

const appointments: Appointment[] = [
  {
    id: "A001",
    startTime: "2025-11-25T08:30:00",
    endTime: "2025-11-25T09:00:00",
    date: "2025-11-25",
    expectedAt: "2025-11-25T08:30:00",
    expectedEnd: "2025-11-25T09:00:00",
    hostId: "E001",
    hostName: "Marco Bianchi",
    visitorName: "John Smith",
    visitorCompany: "DHL Express",
    visitorId: "V001",
    purpose: "Ritiro documenti e verifica area carico",
    location: "Stabilimento A - Ingresso 1",
    status: "SCHEDULED",
  },
  {
    id: "A002",
    startTime: "2025-11-25T09:15:00",
    endTime: "2025-11-25T10:00:00",
    date: "2025-11-25",
    expectedAt: "2025-11-25T09:15:00",
    expectedEnd: "2025-11-25T10:00:00",
    hostId: "E002",
    hostName: "Laura Rossi",
    visitorName: "Sarah Johnson",
    visitorCompany: "KUKA Robotics",
    visitorId: "V003",
    purpose: "Audit qualità linea robotizzata",
    location: "Stabilimento A - Sala Riunioni Qualità",
    status: "CHECKED_IN",
  },
  {
    id: "A003",
    startTime: "2025-11-25T10:00:00",
    endTime: "2025-11-25T11:30:00",
    date: "2025-11-25",
    expectedAt: "2025-11-25T10:00:00",
    expectedEnd: "2025-11-25T11:30:00",
    hostId: "E001",
    hostName: "Marco Bianchi",
    visitorName: "Carlos Lopez",
    visitorCompany: "Siemens",
    visitorId: "V002",
    purpose: "Manutenzione straordinaria quadro elettrico",
    location: "Stabilimento A - Reparto Manutenzione",
    status: "CANCELLED",
  },
]

const meta: Meta<typeof AppointmentsMainView> = {
  title: "Appointments/AppointmentsMainView",
  component: AppointmentsMainView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    employees,
    appointments,
    searchTerm: "",
    selectedEmployeeId: null,
    onSearchTermChange: fn(),
    onEmployeeFilterChange: fn(),
    onAppointmentClick: fn(),
  },
}

export default meta

type Story = StoryObj<typeof AppointmentsMainView>

export const Default: Story = {}

export const FilteredForHost: Story = {
  name: "Filtered for a host",
  args: {
    selectedEmployeeId: "E001",
  },
}

export const EmptyState: Story = {
  args: {
    appointments: [],
  },
}

export type AppointmentStatus = "scheduled" | "checkedIn" | "completed" | "cancelled" | "noShow"

export interface Employee {
  id: string
  fullName: string
  role?: string
  department?: string
  location?: string
}

export interface Appointment {
  id: string
  date: string // e.g. "2025-11-25"
  expectedAt: string // ISO string or already formatted time
  expectedEnd?: string
  hostId: string
  hostName: string
  visitorName: string
  visitorCompany?: string
  knownSuspectId?: string | null
  purpose?: string
  location?: string
  status: AppointmentStatus
}

export interface AppointmentsMainViewProps {
  /** Employees who can receive visitors (for the filter dropdown) */
  employees: Employee[]

  /**
   * Appointments to display for "today".
   * Assume this array is already filtered and sorted by the parent.
   * The component should only group and render what it receives.
   */
  appointments: Appointment[]

  /** Controlled value for the search input (search by visitor name) */
  searchTerm: string

  /**
   * Controlled value for the employee filter.
   * If null or undefined, it means "all employees".
   */
  selectedEmployeeId?: string | null

  /** Called whenever the search input changes */
  onSearchTermChange?: (value: string) => void

  /** Called whenever the employee filter changes */
  onEmployeeFilterChange?: (employeeId: string | null) => void

  /** Called when an appointment card is clicked */
  onAppointmentClick?: (appointmentId: string) => void
}

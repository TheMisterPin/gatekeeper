export type AppointmentStatus =
  | "SCHEDULED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"

export interface Employee {
  id: string
  fullName: string
  role?: string
  department?: string
  location?: string
}

export interface Appointment {
  /** VIS_VisitAppointment.Id */
  id: number | string
  /** VIS_VisitAppointment.ExternalId */
  startTime: string
  /** VIS_VisitAppointment.EndTime */
  endTime?: string | null
  /** Convenience field kept for UI filtering */
  date: string // e.g. "2025-11-25"
  /** Legacy alias kept for UI components (maps to startTime) */
  expectedAt: string // ISO string or already formatted time
  /** Legacy alias kept for UI components (maps to endTime) */
  expectedEnd?: string
  /** VIS_VisitAppointment.HostId */
  hostId: number | string
  /** Resolved host name (not stored on VIS_VisitAppointment) */
  hostName: string
  /** VIS_VisitAppointment.VisitorId */
  visitorId?: string | null
  /** VIS_VisitAppointment.VisitorName */
  visitorName: string
  /** VIS_VisitAppointment.VisitorCompany */
  visitorCompany?: string | null
  /** VIS_VisitAppointment.Purpose */
  purpose?: string | null
  /** VIS_VisitAppointment.Location */
  location?: string | null
  /** VIS_VisitAppointment.Status */
  status: AppointmentStatus
  /** VIS_VisitAppointment.DeviceId */
  deviceId?: string | null
  /** VIS_VisitAppointment.CreatedAt */
  createdAt?: string
  /** VIS_VisitAppointment.UpdatedAt */
  updatedAt?: string
  custString1?: string | null
  custString2?: string | null
  custString3?: string | null
  custInt1?: number | null
  custInt2?: number | null
  custInt3?: number | null
  custDecimal1?: number | null
  custDecimal2?: number | null
  custDecimal3?: number | null
  custBool1?: boolean | null
  custBool2?: boolean | null
  custBool3?: boolean | null
  custDate1?: string | null
  custDate2?: string | null
  custDate3?: string | null
}

export interface AppointmentsMainViewProps {
  /** Employees who can receive visitors (for the filter dropdown) */
  employees: Employee[]

  /**
   * Appointments to display for "today".
   * Assume this array is already filtered and sorted by the parent.
   * The component should only group and render what it receives.
   */
  appointments?: Appointment[]

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
  onAppointmentClick?: (appointment: Appointment) => void

  /** Optional loading flag to show a spinner */
  loading?: boolean

  /** Optional error message to display above the list */
  error?: string | null

  /** Optional list of all selectable dates returned by the API */
  availableDates?: string[]
}

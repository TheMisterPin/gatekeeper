import assert from "node:assert/strict"
import { describe, it, mock } from "node:test"
import AppointmentsMainView from "@/components/appointments-main-view"
import type { Appointment, AppointmentHostGroup } from "@/types/appointments"
import { extractTextContent, findElementsByType } from "../helpers/reactTree"

const sampleAppointments: Appointment[] = [
  {
    id: 101,
    visitorName: "Alice",
    visitorCompany: "Acme",
    hostId: "1",
    hostName: "Mario Rossi",
    status: "SCHEDULED",
    expectedAt: "2025-11-25T09:00:00Z",
    startTime: "2025-11-25T09:00:00Z",
    date: "2025-11-25",
  },
  {
    id: 202,
    visitorName: "Bob",
    visitorCompany: "Beta",
    hostId: "1",
    hostName: "Mario Rossi",
    status: "CHECKED_IN",
    expectedAt: "2025-11-25T10:00:00Z",
    startTime: "2025-11-25T10:00:00Z",
    date: "2025-11-25",
  },
  {
    id: 303,
    visitorName: "Charlie",
    visitorCompany: "Gamma",
    hostId: "2",
    hostName: "Lisa Bianchi",
    status: "CANCELLED",
    expectedAt: "2025-11-25T08:30:00Z",
    startTime: "2025-11-25T08:30:00Z",
    date: "2025-11-25",
  },
]

const groupedAppointments: AppointmentHostGroup[] = [
  {
    hostId: "1",
    hostName: "Mario Rossi",
    department: "Vendite",
    appointments: sampleAppointments.filter((appt) => appt.hostId === "1"),
  },
  {
    hostId: "2",
    hostName: "Lisa Bianchi",
    department: "Finanza",
    appointments: sampleAppointments.filter((appt) => appt.hostId === "2"),
  },
]

const hostOptions = [
  { id: "1", fullName: "Mario Rossi" },
  { id: "2", fullName: "Lisa Bianchi" },
]

const dateOptions = ["2025-11-25"]

describe("AppointmentsMainView", () => {
  it("renders an empty state when there are no appointments", () => {
    const tree = AppointmentsMainView({
      searchTerm: "",
      selectedEmployeeId: null,
      selectedDateFilter: null,
      hostOptions,
      dateOptions,
      groupedAppointments: [],
    })

    const text = extractTextContent(tree)
    assert.match(text, /Nessun appuntamento per oggi/)
    assert.match(text, /Controlla più tardi o verifica i filtri/)
  })

  it("groups appointments by host and sorts them by time", () => {
    const tree = AppointmentsMainView({
      searchTerm: "",
      selectedEmployeeId: null,
      selectedDateFilter: null,
      hostOptions,
      dateOptions,
      groupedAppointments,
    })

    const containerText = extractTextContent(tree)
    assert.ok(
      containerText.indexOf("Mario Rossi") < containerText.indexOf("Lisa Bianchi"),
      "Host groups should render in stable order",
    )

    const hostButtons = findElementsByType(tree, "button")
    const firstButtonText = extractTextContent(hostButtons[0].props.children)
    const secondButtonText = extractTextContent(hostButtons[1].props.children)
    const expectedFirstTime = new Date(sampleAppointments[0].expectedAt).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })
    const expectedSecondTime = new Date(sampleAppointments[1].expectedAt).toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    })
    assert.ok(firstButtonText.includes(expectedFirstTime))
    assert.ok(secondButtonText.includes(expectedSecondTime))
  })

  it("wires appointment click handlers with the selected appointment", () => {
    const onAppointmentClick = mock.fn()

    const tree = AppointmentsMainView({
      searchTerm: "",
      selectedEmployeeId: null,
      selectedDateFilter: null,
      hostOptions,
      dateOptions,
      groupedAppointments,
      onAppointmentClick,
    })

    const firstButton = findElementsByType(tree, "button")[0]
    firstButton.props.onClick()

    assert.equal(onAppointmentClick.mock.calls.length, 1)
    const payload = onAppointmentClick.mock.calls[0].arguments[0] as Appointment
    assert.equal(payload.id, 101)
    assert.equal(payload.visitorName, "Alice")
  })

  it("surfaces Italian status labels and colors", () => {
    const tree = AppointmentsMainView({
      searchTerm: "",
      selectedEmployeeId: null,
      selectedDateFilter: null,
      hostOptions,
      dateOptions,
      groupedAppointments,
    })

    const allBadges = findElementsByType(tree, "span").map((badge) => extractTextContent(badge.props.children))
    assert.ok(allBadges.includes("Programmato"))
    assert.ok(allBadges.includes("In corso"))
    assert.ok(allBadges.includes("Annullato"))
  })
})

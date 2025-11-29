import assert from "node:assert/strict"
import { describe, it, mock } from "node:test"
import AppointmentsMainView from "@/components/appointments-main-view"
import type { Appointment } from "@/types/appointments"
import { extractTextContent, findElementsByType } from "../helpers/reactTree"

const employees = [
  { id: "1", fullName: "Mario Rossi", department: "Vendite" },
  { id: "2", fullName: "Lisa Bianchi", department: "Finanza" },
]

const sampleAppointments: Appointment[] = [
  {
    id: 101,
    visitorName: "Alice",
    visitorCompany: "Acme",
    hostId: "1",
    hostName: "Mario Rossi",
    status: "SCHEDULED",
    expectedAt: "2025-11-25T09:00:00Z",
  },
  {
    id: 202,
    visitorName: "Bob",
    visitorCompany: "Beta",
    hostId: "1",
    hostName: "Mario Rossi",
    status: "CHECKED_IN",
    expectedAt: "2025-11-25T10:00:00Z",
  },
  {
    id: 303,
    visitorName: "Charlie",
    visitorCompany: "Gamma",
    hostId: "2",
    hostName: "Lisa Bianchi",
    status: "CANCELLED",
    expectedAt: "2025-11-25T08:30:00Z",
  },
]

describe("AppointmentsMainView", () => {
  it("renders an empty state when there are no appointments", () => {
    const tree = AppointmentsMainView({
      employees,
      appointments: [],
      searchTerm: "",
      selectedEmployeeId: null,
    })

    const text = extractTextContent(tree)
    assert.match(text, /Nessun appuntamento per oggi/)
    assert.match(text, /Controlla più tardi o verifica i filtri/)
  })

  it("groups appointments by host and sorts them by time", () => {
    const tree = AppointmentsMainView({
      employees,
      appointments: sampleAppointments,
      searchTerm: "",
      selectedEmployeeId: null,
    })

    const containerText = extractTextContent(tree)
    assert.ok(
      containerText.indexOf("Mario Rossi") < containerText.indexOf("Lisa Bianchi"),
      "Host groups should render in stable order",
    )

    const hostButtons = findElementsByType(tree, "button")
    const firstButtonText = extractTextContent(hostButtons[0].props.children)
    assert.match(firstButtonText, /09:00/)
    const secondButtonText = extractTextContent(hostButtons[1].props.children)
    assert.match(secondButtonText, /10:00/)
  })

  it("wires appointment click handlers with the correct id", () => {
    const onAppointmentClick = mock.fn()

    const tree = AppointmentsMainView({
      employees,
      appointments: sampleAppointments,
      searchTerm: "",
      selectedEmployeeId: null,
      onAppointmentClick,
    })

    const firstButton = findElementsByType(tree, "button")[0]
    firstButton.props.onClick()

    assert.equal(onAppointmentClick.mock.calls.length, 1)
    assert.equal(onAppointmentClick.mock.calls[0].arguments[0], "101")
  })

  it("surfaces Italian status labels and colors", () => {
    const tree = AppointmentsMainView({
      employees,
      appointments: sampleAppointments,
      searchTerm: "",
      selectedEmployeeId: null,
    })

    const allBadges = findElementsByType(tree, "span").map((badge) => extractTextContent(badge.props.children))
    assert.ok(allBadges.includes("Programmato"))
    assert.ok(allBadges.includes("In corso"))
    assert.ok(allBadges.includes("Annullato"))
  })
})

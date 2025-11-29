import assert from "node:assert/strict"
import { describe, it } from "node:test"
import ArrivalCheckInModal from "@/components/arrival-check-in-modal"
import type { ArrivalAppointmentInfo } from "@/types"
import { extractTextContent, findButtonByLabel, findElementsByType } from "../helpers/reactTree"

const appointment: ArrivalAppointmentInfo = {
  id: "999",
  visitorName: "Giulia Verde",
  visitorCompany: "Orchard Labs",
  hostName: "Marco Polo",
  scheduledTime: "14:30",
  location: "Sala Nord",
}

describe("ArrivalCheckInModal", () => {
  it("renders nothing when the modal is closed", () => {
    const tree = ArrivalCheckInModal({
      open: false,
      onClose: () => {},
      mainConsentChecked: false,
      biometricConsentChecked: false,
      isCameraActive: false,
      onCameraToggle: () => {},
      onCapturePhoto: () => {},
      onConfirmCheckIn: () => {},
      onDownloadBadge: () => {},
      todayLabel: "25/11/2025",
    })

    assert.equal(tree, null)
  })

  it("displays appointment information and disables actions until consents arrive", () => {
    const tree = ArrivalCheckInModal({
      open: true,
      onClose: () => {},
      appointment,
      mainConsentChecked: false,
      biometricConsentChecked: false,
      isCameraActive: false,
      onCameraToggle: () => {},
      onCapturePhoto: () => {},
      onConfirmCheckIn: () => {},
      onDownloadBadge: () => {},
      todayLabel: "25/11/2025",
      capturedImageUrl: undefined,
    })

    const text = extractTextContent(tree)
    assert.match(text, /Giulia Verde/)
    assert.match(text, /Orchard Labs/)
    assert.match(text, /Sala Nord/)

    const buttons = findElementsByType(tree, "button")
    const confirm = findButtonByLabel(tree, "Conferma arrivo")
    assert.ok(confirm?.props.disabled)

    const capture = findButtonByLabel(tree, "Scatta foto")
    assert.ok(capture?.props.disabled)

    assert.ok(buttons.some((button) => button.props.onClick))
  })

  it("enables confirm and download actions when requirements are met", () => {
    const tree = ArrivalCheckInModal({
      open: true,
      onClose: () => {},
      appointment,
      mainConsentChecked: true,
      biometricConsentChecked: true,
      isCameraActive: true,
      capturedImageUrl: "blob:photo",
      onCameraToggle: () => {},
      onCapturePhoto: () => {},
      onConfirmCheckIn: () => {},
      onDownloadBadge: () => {},
      todayLabel: "25/11/2025",
    })

    const confirm = findButtonByLabel(tree, "Conferma arrivo")
    assert.equal(confirm?.props.disabled, false)

    const download = findButtonByLabel(tree, "Scarica badge")
    assert.equal(download?.props.disabled, false)
  })
})

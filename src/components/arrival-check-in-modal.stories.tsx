import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import type { ArrivalAppointmentInfo } from "@/types/arrival"
import ArrivalCheckInModal from "./arrival-check-in-modal"

const sampleAppointment: ArrivalAppointmentInfo = {
  id: "A001",
  visitorName: "John Smith",
  visitorCompany: "DHL Express",
  hostName: "Marco Bianchi",
  scheduledTime: "08:30",
  location: "Stabilimento A - Ingresso 1",
}

const meta: Meta<typeof ArrivalCheckInModal> = {
  title: "Arrivals/ArrivalCheckInModal",
  component: ArrivalCheckInModal,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    open: true,
    appointment: sampleAppointment,
    mainConsentChecked: true,
    biometricConsentChecked: false,
    isCameraActive: false,
    todayLabel: "25/11/2025",
    onClose: fn(),
    onMainConsentChange: fn(),
    onBiometricConsentChange: fn(),
    onCameraToggle: fn(),
    onCapturePhoto: fn(),
    onConfirmCheckIn: fn(),
    onDownloadBadge: fn(),
  },
}

export default meta

type Story = StoryObj<typeof ArrivalCheckInModal>

export const Default: Story = {}

export const CameraPreview: Story = {
  args: {
    biometricConsentChecked: true,
    isCameraActive: true,
  },
}

export const WithCapturedPhoto: Story = {
  args: {
    biometricConsentChecked: true,
    capturedImageUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80",
  },
}

export const LoadingCheckIn: Story = {
  args: {
    loading: true,
    mainConsentChecked: false,
  },
}

export interface ArrivalAppointmentInfo {
  id: string
  visitorName: string
  visitorCompany?: string
  hostName: string
  scheduledTime: string // already formatted, e.g. "08:30"
  location?: string
}

export interface ArrivalCheckInModalProps {
  /** Whether the modal is visible */
  open: boolean

  /** Called when the modal should be closed (e.g. overlay click, cancel button) */
  onClose?: () => void

  /** Appointment info for the arriving visitor */
  appointment: ArrivalAppointmentInfo | null

  /** Main data processing consent (required for check-in) */
  mainConsentChecked: boolean

  /** Biometric/photo consent (optional) */
  biometricConsentChecked: boolean

  /** Called when main consent checkbox is toggled */
  onMainConsentChange?: (value: boolean) => void

  /** Called when biometric consent checkbox is toggled */
  onBiometricConsentChange?: (value: boolean) => void

  /** Whether the camera is currently active (preview mode) */
  isCameraActive: boolean

  /** URL or data URL of the captured image, if any */
  capturedImageUrl?: string

  /** Video element ref for live camera preview */
  videoRef: React.RefObject<HTMLVideoElement>

  /** Called when user clicks the button to start/stop the camera preview */
  onCameraToggle?: () => void

  /** Called when user clicks the "capture photo" button */
  onCapturePhoto?: () => void

  /** Called when user confirms the arrival/check-in */
  onConfirmCheckIn?: () => void

  /**
   * Called when user clicks "Download badge".
   * The parent will handle the actual badge generation and download.
   */
  onDownloadBadge?: () => void

  /**
   * Formatted representation of today's date, to be shown on the badge.
   * Example: "25/11/2025".
   */
  todayLabel: string

  /** Optional loading flag for when the check-in action is in progress */
  loading?: boolean
}

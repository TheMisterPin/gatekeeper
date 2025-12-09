/* eslint-disable react/no-unescaped-entities */
"use client"

import type { ArrivalCheckInModalProps } from "@/types/arrival"

/**
 * Modale interattiva per gestire check-in visitatore con raccolta consensi, foto e generazione badge.
 */
export default function ArrivalCheckInModal({
  open,
  onClose,
  appointment,
  mainConsentChecked,
  biometricConsentChecked,
  onMainConsentChange,
  onBiometricConsentChange,
  isCameraActive,
  capturedImageUrl,
  videoRef,
  onCameraToggle,
  onCapturePhoto,
  onConfirmCheckIn,
  onDownloadBadge,
  todayLabel,
  loading = false,
}: ArrivalCheckInModalProps) {
  if (!open) return null

  const isConfirmDisabled = !mainConsentChecked || loading
  const isCaptureDisabled = !isCameraActive || !biometricConsentChecked

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900">Arrivo visitatore</h2>

          {/* Appointment Info */}
          {appointment ? (
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{appointment.visitorName}</span>
                {appointment.visitorCompany && <span className="text-gray-500">· {appointment.visitorCompany}</span>}
              </div>
              <div className="text-gray-600">
                Ospite di <span className="font-medium">{appointment.hostName}</span>
              </div>
              <div className="text-gray-500">
                {appointment.scheduledTime}
                {appointment.location && ` · ${appointment.location}`}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">Nessun appuntamento selezionato</p>
          )}
        </div>

        {/* Body - Two columns on desktop, stacked on mobile */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Consents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Consensi</h3>

              {/* Main consent checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={mainConsentChecked}
                  onChange={(e) => onMainConsentChange?.(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                  Autorizzo il trattamento dei miei dati personali per la registrazione dell'accesso.
                </span>
              </label>

              {/* Biometric consent checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={biometricConsentChecked}
                  onChange={(e) => onBiometricConsentChange?.(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-900">
                  Autorizzo l'acquisizione e l'utilizzo della mia immagine per l'identificazione all'ingresso.
                </span>
              </label>

              {/* Note about photo capture */}
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Nota:</strong> L'acquisizione della foto è facoltativa e richiede il consenso biometrico.
                  Senza foto, verrà emesso un badge temporaneo senza immagine.
                </p>
              </div>
            </div>

            {/* Right Column - Camera & Badge */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Foto e badge</h3>

              {/* Camera Panel */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="h-56 bg-gray-100 flex items-center justify-center relative">
                  {capturedImageUrl ? (
                    <img
                      src={capturedImageUrl || "/placeholder.svg"}
                      alt="Foto acquisita"
                      className="w-full h-full object-cover"
                    />
                  ) : isCameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-sm">{isCameraActive ? "Anteprima fotocamera" : "Nessuna foto acquisita"}</p>
                    </div>
                  )}
                </div>

                {/* Camera controls */}
                <div className="p-3 bg-gray-50 flex gap-2">
                  <button
                    onClick={onCameraToggle}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isCameraActive ? "Chiudi fotocamera" : "Apri fotocamera"}
                  </button>
                  <button
                    onClick={onCapturePhoto}
                    disabled={isCaptureDisabled}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Scatta foto
                  </button>
                </div>
              </div>

              {/* Badge Preview */}
              {appointment && (
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Anteprima badge</h4>
                  <div className="flex gap-4 items-start">
                    {/* Photo placeholder or captured image */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border border-gray-300 overflow-hidden">
                      {capturedImageUrl ? (
                        <img
                          src={capturedImageUrl || "/placeholder.svg"}
                          alt="Badge photo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Badge info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{appointment.visitorName}</p>
                      {appointment.visitorCompany && (
                        <p className="text-sm text-gray-600 truncate">{appointment.visitorCompany}</p>
                      )}
                      <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                        <p>Data: {todayLabel}</p>
                        <p>Ospite di: {appointment.hostName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Download badge button */}
                  <button
                    onClick={onDownloadBadge}
                    disabled={!capturedImageUrl}
                    className="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
                  >
                    Scarica badge
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Annulla
          </button>

          <div className="flex items-center gap-4">
            {loading && <span className="text-sm text-gray-600">Registrazione in corso...</span>}
            <button
              onClick={onConfirmCheckIn}
              disabled={isConfirmDisabled}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Conferma arrivo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

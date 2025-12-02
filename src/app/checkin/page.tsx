"use client";

import { useEffect, useMemo, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useErrorDialog } from "@/hooks/ErrorDialogContext";
import { Appointment } from "@/types";
import { mapApiAppointmentRow } from "@/utils/mappers/appointment- mapper";

const TODAY = "2025-11-25";

function formatTimeLabel(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.slice(11, 16);
}

function formatDateLabel(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export default function CheckInPage() {
  const [hasAppointment, setHasAppointment] = useState<boolean | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [badgeChoice, setBadgeChoice] = useState<"si" | "no" | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const { reportError } = useErrorDialog();

  const { isCameraActive, capturedImageUrl, startCamera, stopCamera, capturePhoto } = useCamera();

  useEffect(() => {
    let cancelled = false;

    const loadAppointments = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/appointments?status=ALL", {
          method: "GET",
          cache: "no-store",
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message = payload?.error ?? "Impossibile recuperare gli appuntamenti";
          throw new Error(`[${response.status}] ${message}`);
        }
        const rows: any[] = payload?.appointments ?? [];
        if (!cancelled) {
          setAppointments(rows.map(mapApiAppointmentRow));
        }
      } catch (err) {
        if (!cancelled) {
          reportError(err, {
            source: "public-checkin/appointments",
            title: "Impossibile recuperare gli appuntamenti",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAppointments();

    return () => {
      cancelled = true;
    };
  }, [reportError]);

  const todaysAppointments = useMemo(
    () =>
      appointments.filter((appt) => {
        const fromStart = appt.startTime?.slice(0, 10);
        return (appt.date ?? fromStart) === TODAY;
      }),
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    if (!searchTerm.trim()) return todaysAppointments;
    const term = searchTerm.toLowerCase();
    return todaysAppointments.filter((appt) =>
      appt.visitorName.toLowerCase().includes(term)
    );
  }, [todaysAppointments, searchTerm]);

  const selectedAppointment = selectedAppointmentId
    ? todaysAppointments.find((appt) => String(appt.id) === selectedAppointmentId) ?? null
    : null;

  function resetFlow() {
    setSelectedAppointmentId(null);
    setAppointmentConfirmed(false);
    setBadgeChoice(null);
    setStatusMessage("");
    setSearchTerm("");
    if (isCameraActive) {
      stopCamera();
    }
  }

  function handleConfirmAppointment() {
    if (!selectedAppointment) return;
    setAppointmentConfirmed(true);
    setBadgeChoice(null);
    setStatusMessage("");
  }

  function updateAppointmentStatus(id: string | number, status: Appointment["status"]) {
    setAppointments((prev) =>
      prev.map((appt) =>
        String(appt.id) === String(id)
          ? {
              ...appt,
              status,
            }
          : appt
      )
    );
  }

  function handleBadgeChoice(choice: "si" | "no") {
    setBadgeChoice(choice);
    if (!selectedAppointment) return;

    if (choice === "si") {
      startCamera();
      setStatusMessage("La fotocamera è pronta per la stampa del badge.");
    } else {
      updateAppointmentStatus(selectedAppointment.id, "CHECKED_IN");
      setStatusMessage("Check-in completato senza badge.");
      if (isCameraActive) stopCamera();
    }
  }

  function handleCompleteWithBadge() {
    if (!selectedAppointment) return;
    if (!capturedImageUrl) {
      reportError("Scatta una foto prima di procedere.", {
        severity: "warning",
        source: "public-checkin/badge",
        title: "Foto non disponibile",
      });
      return;
    }
    updateAppointmentStatus(selectedAppointment.id, "CHECKED_IN");
    setStatusMessage("Badge generato e check-in completato.");
    stopCamera();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white shadow-sm rounded-lg p-6 space-y-6">
        <header className="space-y-2 text-center">
          <p className="text-sm text-gray-500">{formatDateLabel(TODAY)}</p>
          <h1 className="text-2xl font-semibold text-gray-900">Check-in visitatori</h1>
          <p className="text-gray-600">
            Questa procedura è accessibile a tutti i visitatori per registrare il proprio arrivo.
          </p>
        </header>

        {hasAppointment === null && (
          <div className="space-y-4 text-center">
            <h2 className="text-lg font-medium text-gray-800">Hai un appuntamento?</h2>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={() => setHasAppointment(true)}
              >
                Sì
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                onClick={() => setHasAppointment(false)}
              >
                No
              </button>
            </div>
          </div>
        )}

        {hasAppointment === false && (
          <div className="space-y-3">
            <p className="text-gray-700">
              Non hai un appuntamento programmato. Per favore rivolgiti alla reception per ricevere assistenza.
            </p>
            <button
              className="text-sm text-blue-700 hover:text-blue-800"
              onClick={() => setHasAppointment(null)}
            >
              Torna indietro
            </button>
          </div>
        )}

        {hasAppointment === true && (
          <div className="space-y-6">
            {loading && <p className="text-sm text-gray-500">Caricamento appuntamenti…</p>}
            <div className="space-y-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Cerca il tuo nome
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Digita il tuo nome per filtrare gli appuntamenti"
              />
              <p className="text-xs text-gray-500">Solo gli appuntamenti di oggi sono mostrati.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments.map((appt) => {
                const isSelected = String(appt.id) === selectedAppointmentId;
                return (
                  <button
                    key={appt.id}
                    onClick={() => {
                      setSelectedAppointmentId(String(appt.id));
                      setAppointmentConfirmed(false);
                      setBadgeChoice(null);
                      setStatusMessage("");
                      if (isCameraActive) stopCamera();
                    }}
                    className={`border rounded-lg p-4 text-left transition shadow-sm hover:shadow-md ${
                      isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Visitatore</p>
                        <p className="text-lg font-semibold text-gray-900">{appt.visitorName}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        {appt.status}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-gray-700">
                      <p className="font-medium">Host: {appt.hostName}</p>
                      <p>Orario: {formatTimeLabel(appt.startTime)}</p>
                      {appt.location && <p>Luogo: {appt.location}</p>}
                    </div>
                  </button>
                );
              })}
              {filteredAppointments.length === 0 && (
                <div className="col-span-full text-center text-gray-600 border border-dashed border-gray-300 rounded-md p-6">
                  Nessun appuntamento trovato per questo nome.
                </div>
              )}
            </div>

            {selectedAppointment && (
              <div className="space-y-4 border border-blue-100 bg-blue-50 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Hai selezionato</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedAppointment.visitorName}</p>
                    <p className="text-sm text-gray-700">Host: {selectedAppointment.hostName}</p>
                    <p className="text-sm text-gray-700">
                      Orario: {formatTimeLabel(selectedAppointment.startTime)}
                    </p>
                  </div>
                  <button
                    onClick={resetFlow}
                    className="text-sm text-blue-700 hover:text-blue-800"
                  >
                    Cambia scelta
                  </button>
                </div>

                <button
                  className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  onClick={handleConfirmAppointment}
                >
                  Conferma appuntamento
                </button>

                {appointmentConfirmed && (
                  <div className="space-y-3">
                    <p className="font-medium text-gray-800">Vuoi stampare un badge?</p>
                    <div className="flex gap-3">
                      <button
                        className={`px-4 py-2 rounded-md border ${
                          badgeChoice === "si" ? "bg-blue-600 text-white" : "border-gray-300 text-gray-800"
                        }`}
                        onClick={() => handleBadgeChoice("si")}
                      >
                        Sì, prosegui con la fotocamera
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md border ${
                          badgeChoice === "no" ? "bg-gray-800 text-white" : "border-gray-300 text-gray-800"
                        }`}
                        onClick={() => handleBadgeChoice("no")}
                      >
                        No, registra solo l'arrivo
                      </button>
                    </div>
                  </div>
                )}

                {badgeChoice === "si" && (
                  <div className="space-y-3 border border-gray-200 rounded-md p-4 bg-white">
                    <p className="text-gray-800 font-medium">Scatta una foto per il badge</p>
                    <div className="flex flex-wrap gap-3 items-center">
                      <button
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                        onClick={startCamera}
                      >
                        {isCameraActive ? "Riapri fotocamera" : "Attiva fotocamera"}
                      </button>
                      <button
                        className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-900 transition disabled:opacity-50"
                        disabled={!isCameraActive}
                        onClick={capturePhoto}
                      >
                        Scatta foto
                      </button>
                      <button
                        className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50"
                        disabled={!capturedImageUrl}
                        onClick={handleCompleteWithBadge}
                      >
                        Completa check-in
                      </button>
                      {isCameraActive && (
                        <button
                          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                          onClick={stopCamera}
                        >
                          Ferma fotocamera
                        </button>
                      )}
                    </div>
                    {capturedImageUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Anteprima badge</p>
                        <img
                          src={capturedImageUrl}
                          alt="Anteprima del badge"
                          className="w-40 h-40 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                )}

                {statusMessage && (
                  <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3 text-emerald-800">
                    {statusMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import AppointmentsMainView from "../components/appointments-main-view";
import ArrivalCheckInModal from "@/components/arrival-check-in-modal";

import { useAuth } from "@/hooks/auth-context";
import { useErrorDialog } from "@/hooks/ErrorDialogContext";
import { useCamera } from "../hooks/useCamera";
import { downloadBadgeImage } from "../utils/badge";

import { Appointment, ArrivalAppointmentInfo, AppointmentStatus, Employee } from "@/types";
import { HeaderLogo } from "@/components/layout-elements/header-logo";
import { mapApiAppointmentRow, mapAppointmentToArrivalInfo } from "@/utils/mappers/appointment- mapper";
import { formatTodayLabel } from "@/utils/date-utils";




const HomePage: React.FC = () => {
  const { reportError } = useErrorDialog();
  const { isAuthenticated, currentUserName, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );

  // Appointments data fetched from the API
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // Arrival modal state
  const [selectedAppointment, setSelectedAppointment] = useState<
    Appointment | null
  >(null);
  const [mainConsentChecked, setMainConsentChecked] = useState(false);
  const [biometricConsentChecked, setBiometricConsentChecked] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);

  // Camera hook (handles getUserMedia + capture)
  const {
    isCameraActive,
    capturedImageUrl,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();

  const todayLabel = formatTodayLabel();

  // Load today's appointments from the API
  useEffect(() => {
    let cancelled = false;

    const fetchAppointments = async () => {
      setAppointmentsLoading(true);
      setAppointmentsError(null);
      try {
        console.info("[appointments] fetching");
        const response = await fetch(`/api/appointments`, {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message = payload?.error ?? "Richiesta appuntamenti non riuscita";
          throw new Error(`[${response.status}] ${message}`);
        }
        const rows: any[] = payload?.appointments ?? [];
        const employeesPayload: any[] = Array.isArray(payload?.employees) ? payload.employees : [];
        const datesPayload: any[] = Array.isArray(payload?.dates) ? payload.dates : [];
        if (!cancelled) {
          setAppointments(rows.map(mapApiAppointmentRow));
          setEmployees(
            employeesPayload
              .map((emp) => {
                const id = emp?.id ?? emp?.HostId ?? emp?.hostId;
                if (!id) return null;
                return {
                  id: String(id),
                  fullName: emp?.fullName ?? emp?.HostName ?? emp?.hostName ?? String(id),
                  role: emp?.role ?? undefined,
                  department: emp?.department ?? undefined,
                  location: emp?.location ?? undefined,
                } as Employee;
              })
              .filter(Boolean) as Employee[],
          );
          setAvailableDates(
            datesPayload
              .map((date) => {
                if (!date) return null;
                return typeof date === "string" ? date : String(date);
              })
              .filter(Boolean) as string[],
          );
          console.info("[appointments] received rows", rows.length);
          if (rows.length === 0) {
            console.warn("[appointments] Nessun appuntamento restituito. Verificare la sorgente dati o il filtro data.");
          }
        }
      } catch (err) {
        console.error("Unable to load appointments", err);
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
          setAppointmentsError(message);
          reportError(err, {
            source: "appointments/fetch",
            title: "Impossibile caricare gli appuntamenti",
            details: message,
          });
        }
      } finally {
        if (!cancelled) {
          setAppointmentsLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      cancelled = true;
    };
  }, [reportError]);

  // Server already filters by date; keep memoized reference
  const todaysAppointments: Appointment[] = useMemo(() => appointments, [appointments]);

  // Apply search + employee filter + sort (by host, then time)
  const filteredAppointments: Appointment[] = useMemo(() => {
    let result = todaysAppointments;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((a) =>
        a.visitorName.toLowerCase().includes(term)
      );
    }

    if (selectedEmployeeId) {
      result = result.filter((a) => String(a.hostId) === selectedEmployeeId);
    }

    // sort by hostName, then startTime
    return [...result].sort((a, b) => {
      if (a.hostName < b.hostName) return -1;
      if (a.hostName > b.hostName) return 1;
      const timeA = a.startTime ?? a.expectedAt;
      const timeB = b.startTime ?? b.expectedAt;
      if ((timeA ?? "") < (timeB ?? "")) return -1;
      if ((timeA ?? "") > (timeB ?? "")) return 1;
      return 0;
    });
  }, [todaysAppointments, searchTerm, selectedEmployeeId]);

  const arrivalAppointmentInfo: ArrivalAppointmentInfo | null =
    selectedAppointment ? mapAppointmentToArrivalInfo(selectedAppointment) : null;

  // Close modal if the selected appointment disappears (e.g. after data refresh)
  useEffect(() => {
    if (!selectedAppointment) return;
    const stillExists = appointments.some(
      (appointment) => String(appointment.id) === String(selectedAppointment.id),
    );
    if (!stillExists) {
      setSelectedAppointment(null);
    }
  }, [appointments, selectedAppointment]);

  function handleLogout() {
    logout();
    setSelectedAppointment(null);
    setMainConsentChecked(false);
    setBiometricConsentChecked(false);
    setCheckInLoading(false);
    if (isCameraActive) {
      stopCamera();
    }
  }

  function handleAppointmentClick(appointment: Appointment) {
    setSelectedAppointment(appointment);
    setMainConsentChecked(false);
    setBiometricConsentChecked(false);
    startCamera();
  }

  function handleCloseArrivalModal() {
    setSelectedAppointment(null);
    setMainConsentChecked(false);
    setBiometricConsentChecked(false);
    if (isCameraActive) {
      stopCamera();
    }
  }

  async function handleConfirmCheckIn() {
    if (!selectedAppointment) return;
    if (!mainConsentChecked) {
      window.alert("È necessario il consenso al trattamento dati per procedere.");
      return;
    }

    const appointmentToConfirm = selectedAppointment;
    const normalizedAppointmentId =
      typeof appointmentToConfirm.id === "number"
        ? appointmentToConfirm.id
        : Number(appointmentToConfirm.id);

    if (!Number.isFinite(normalizedAppointmentId)) {
      reportError("Impossibile registrare l'arrivo perché l'appuntamento non proviene dal server.", {
        source: "appointments/checkin",
        title: "Check-in non disponibile",
      });
      return;
    }

    setCheckInLoading(true);
    try {
      const response = await fetch(`/api/appointments/${normalizedAppointmentId}/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitorId: appointmentToConfirm.visitorId ?? null,
          biometricConsent: biometricConsentChecked,
          badgePhotoAttached: Boolean(capturedImageUrl),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const errorMessage = body?.error ?? "Richiesta di check-in non riuscita";
        throw new Error(`[${response.status}] ${errorMessage}`);
      }

      setAppointments((current) =>
        current.map((appt) =>
          String(appt.id) === String(appointmentToConfirm.id)
            ? { ...appt, status: "CHECKED_IN" as AppointmentStatus }
            : appt,
        ),
      );
      setSelectedAppointment(null);
      if (isCameraActive) {
        stopCamera();
      }
    } catch (err) {
      console.error("Check-in failed", err);
      reportError(err, {
        source: "appointments/checkin",
        title: "Errore durante la registrazione dell'arrivo",
        details: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setCheckInLoading(false);
    }
  }

  async function handleDownloadBadge() {
    if (!selectedAppointment || !capturedImageUrl) {
      return;
    }

    try {
      await downloadBadgeImage({
        visitorName: selectedAppointment.visitorName,
        visitorCompany: selectedAppointment.visitorCompany ?? undefined,
        hostName: selectedAppointment.hostName,
        dateLabel: todayLabel,
        photoUrl: capturedImageUrl,
      })
    } catch (err) {
      console.error("Badge download failed", err);
      window.alert("Impossibile generare il badge.");
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppShell
      logo={<HeaderLogo />}
      currentUserName={currentUserName}
      onLogout={handleLogout}
      navItems={[
        { id: "dashboard", label: "Dashboard", isActive: true },
        { id: "history", label: "Storico", isActive: false },
      ]}
      onNavItemClick={(id) => {
        console.log("Nav click", id);
      }}
    >
      {/* Main content when authenticated: appointments page */}
        <AppointmentsMainView
          employees={employees}
          appointments={filteredAppointments}
          searchTerm={searchTerm}
          selectedEmployeeId={selectedEmployeeId}
          onSearchTermChange={setSearchTerm}
          onEmployeeFilterChange={setSelectedEmployeeId}
          onAppointmentClick={handleAppointmentClick}
          loading={appointmentsLoading}
          error={appointmentsError}
          availableDates={availableDates}
        />
  

      {/* Arrival modal */}
      <ArrivalCheckInModal
        open={selectedAppointment != null}
        onClose={handleCloseArrivalModal}
        appointment={arrivalAppointmentInfo}
        mainConsentChecked={mainConsentChecked}
        biometricConsentChecked={biometricConsentChecked}
        onMainConsentChange={setMainConsentChecked}
        onBiometricConsentChange={setBiometricConsentChecked}
        isCameraActive={isCameraActive}
        capturedImageUrl={capturedImageUrl || undefined}
        videoRef={videoRef}
        onCameraToggle={() => {
          if (isCameraActive) {
            stopCamera();
          } else {
            startCamera();
          }
        }}
        onCapturePhoto={capturePhoto}
        onConfirmCheckIn={handleConfirmCheckIn}
        onDownloadBadge={handleDownloadBadge}
        todayLabel={todayLabel}
        loading={checkInLoading}
      />
    </AppShell>
  );
};

export default HomePage;

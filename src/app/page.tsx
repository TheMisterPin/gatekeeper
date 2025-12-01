
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";
import AppointmentsMainView from "../components/appointments-main-view";
import ArrivalCheckInModal from "@/components/arrival-check-in-modal";

import { useAuth } from "@/hooks/auth-context";
import { useErrorDialog } from "@/hooks/ErrorDialogContext";
import { useCamera } from "../hooks/useCamera";
import { mockAppointments, mockEmployees } from "../lib/mockData";
import { downloadBadgeImage } from "../utils/badge";
import { Appointment, ArrivalAppointmentInfo } from "@/types";
import { HeaderLogo } from "@/components/layout-elements/header-logo";


const TODAY = new Date().toISOString().slice(0, 10); 
function mapAppointmentToArrivalInfo(appointment: Appointment): ArrivalAppointmentInfo {
  const scheduledIso = appointment.startTime ?? appointment.expectedAt;
  return {
    id: String(appointment.id),
    visitorName: appointment.visitorName,
    visitorCompany: appointment.visitorCompany ?? undefined,
    hostName: appointment.hostName,
    scheduledTime: scheduledIso ? scheduledIso.slice(11, 16) : "",
    location: appointment.location ?? undefined,
  };
}

function formatTodayLabel(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

const HomePage: React.FC = () => {
  useErrorDialog();
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

  const todayLabel = formatTodayLabel(TODAY);

  // Pre-filter appointments to "today" only
  const todaysAppointments: Appointment[] = useMemo(
    () =>
      mockAppointments.filter((a) => {
        const dateFromStart = a.startTime?.slice(0, 10);
        return (a.date ?? dateFromStart) === TODAY;
      }),
    []
  );

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

    // Here you would call your backend to mark the appointment as checked-in
    // and create the corresponding VisitLog record.
    setCheckInLoading(true);
    try {
      console.log("Check-in appointment", {
        appointmentId: selectedAppointment.id
      });
      // naive mock delay to simulate network call
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.alert("Arrivo registrato.");
      setSelectedAppointment(null);
      if (isCameraActive) {
        stopCamera();
      }
    } catch (err) {
      console.error("Check-in failed", err);
      window.alert("Errore durante la registrazione dell'arrivo.");
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
          employees={mockEmployees}
          appointments={filteredAppointments}
          searchTerm={searchTerm}
          selectedEmployeeId={selectedEmployeeId}
          onSearchTermChange={setSearchTerm}
          onEmployeeFilterChange={setSelectedEmployeeId}
          onAppointmentClick={handleAppointmentClick}
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

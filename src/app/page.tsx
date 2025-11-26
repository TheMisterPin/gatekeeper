
"use client";

import React, { useMemo, useState } from "react";
import AppShell from "@/components/app-shell";
import AppointmentsMainView from "../components/appointments-main-view";

import ArrivalCheckInModal from "@/components/arrival-check-in-modal";

import { mockAppointments, mockEmployees } from "../lib/mockData";
import { useCamera } from "../hooks/useCamera";
import { downloadBadgeImage } from "../utils/badge";
import { Appointment, ArrivalAppointmentInfo } from "@/types";

// Types copied from AppShell prompt for reference
interface LoginFormValues {
  serverIp: string;
  resourceName: string;
  deviceName: string;
}

const TODAY = "2025-11-25"; // TODO: replace with dynamic date in real implementation

function mapAppointmentToArrivalInfo(appointment: Appointment): ArrivalAppointmentInfo {
  return {
    id: appointment.id,
    visitorName: appointment.visitorName,
    visitorCompany: appointment.visitorCompany,
    hostName: appointment.hostName,
    scheduledTime: appointment.expectedAt.slice(11, 16), // naive "HH:MM" from ISO
    location: appointment.location,
  };
}

function formatTodayLabel(date: string): string {
  // very dumb formatter: "2025-11-25" -> "25/11/2025"
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

const HomePage: React.FC = () => {
  // Auth / device state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | undefined>();
  const [serverIp, setServerIp] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );

  // Arrival modal state
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [mainConsentChecked, setMainConsentChecked] = useState(false);
  const [biometricConsentChecked, setBiometricConsentChecked] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);

  // Camera hook (handles getUserMedia + capture)
  const {
    isCameraActive,
    capturedImageUrl,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();

  const todayLabel = formatTodayLabel(TODAY);

  // Pre-filter appointments to "today" only
  const todaysAppointments: Appointment[] = useMemo(
    () => mockAppointments.filter((a) => a.date === TODAY),
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
      result = result.filter((a) => a.hostId === selectedEmployeeId);
    }

    // sort by hostName, then expectedAt
    return [...result].sort((a, b) => {
      if (a.hostName < b.hostName) return -1;
      if (a.hostName > b.hostName) return 1;
      // naive comparison of ISO-ish strings
      if (a.expectedAt < b.expectedAt) return -1;
      if (a.expectedAt > b.expectedAt) return 1;
      return 0;
    });
  }, [todaysAppointments, searchTerm, selectedEmployeeId]);

  const selectedAppointment: Appointment | null =
    selectedAppointmentId != null
      ? todaysAppointments.find((a) => a.id === selectedAppointmentId) ?? null
      : null;

  const arrivalAppointmentInfo: ArrivalAppointmentInfo | null =
    selectedAppointment ? mapAppointmentToArrivalInfo(selectedAppointment) : null;

  async function handleLoginSubmit(values: LoginFormValues) {
    setLoginSubmitting(true);
    try {
      // Mock the fetch call for now
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

      // Mock successful response
      setIsAuthenticated(true);
      setCurrentUserName(values.resourceName);
      setServerIp(values.serverIp);
      setDeviceName(values.deviceName);
    } catch (err) {
      console.error("Login failed", err);
      window.alert(
        "Impossibile connettersi al server specificato. Verifica IP e connettività."
      );
    } finally {
      setLoginSubmitting(false);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setCurrentUserName(undefined);
    setServerIp(null);
    setDeviceName(null);
    setSelectedAppointmentId(null);
    setMainConsentChecked(false);
    setBiometricConsentChecked(false);
    setCheckInLoading(false);
    if (isCameraActive) {
      stopCamera();
    }
  }

  function handleAppointmentClick(id: string) {
    setSelectedAppointmentId(id);
    setMainConsentChecked(false);
    setBiometricConsentChecked(false);
  }

  function handleCloseArrivalModal() {
    setSelectedAppointmentId(null);
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
        appointmentId: selectedAppointment.id,
        serverIp,
        deviceName,
      });
      // naive mock delay to simulate network call
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.alert("Arrivo registrato.");
      setSelectedAppointmentId(null);
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
        visitorCompany: selectedAppointment.visitorCompany,
        hostName: selectedAppointment.hostName,
        dateLabel: todayLabel,
        photoUrl: capturedImageUrl,
      });
    } catch (err) {
      console.error("Badge download failed", err);
      window.alert("Impossibile generare il badge.");
    }
  }

  return (
    <AppShell
      logo={<span className="font-bold tracking-tight">FactoryGate</span>}
      isAuthenticated={isAuthenticated}
      currentUserName={currentUserName}
      onLogout={handleLogout}
      navItems={[
        { id: "dashboard", label: "Dashboard", isActive: true },
        { id: "history", label: "Storico", isActive: false },
      ]}
      onNavItemClick={(id) => {
        console.log("Nav click", id);
      }}
      onLoginSubmit={handleLoginSubmit}
      loginSubmitting={loginSubmitting}
    >
      {/* Main content when authenticated: appointments page */}
      <div className="flex flex-col h-full">
        <AppointmentsMainView
          employees={mockEmployees}
          appointments={filteredAppointments}
          searchTerm={searchTerm}
          selectedEmployeeId={selectedEmployeeId}
          onSearchTermChange={setSearchTerm}
          onEmployeeFilterChange={setSelectedEmployeeId}
          onAppointmentClick={handleAppointmentClick}
        />
      </div>

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

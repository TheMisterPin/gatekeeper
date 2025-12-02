"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/auth-context";
import { useErrorDialog } from "@/hooks/ErrorDialogContext";
import { useCamera } from "@/hooks/useCamera";
import { useConsent } from "@/hooks/useConsent";
import { downloadBadgeImage } from "@/utils/badge";
import { formatTodayLabel } from "@/utils/date-utils";
import { mapApiAppointmentRow, mapAppointmentToArrivalInfo } from "@/utils/mappers/appointment- mapper";
import type {
  Appointment,
  AppointmentHostGroup,
  AppointmentStatus,
  Employee,
  HostOption,
} from "@/types/appointments";
import type { ArrivalAppointmentInfo } from "@/types/arrival";

interface ScheduleControllerValue {
  isAuthenticated: boolean;
  currentUserName?: string;
  handleLogout: () => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (value: string | null) => void;
  selectedDateFilter: string | null;
  setSelectedDateFilter: (value: string | null) => void;
  hostOptions: HostOption[];
  dateOptions: string[];
  groupedAppointments: AppointmentHostGroup[];
  appointmentsLoading: boolean;
  handleAppointmentClick: (appointment: Appointment) => void;
  handleCloseArrivalModal: () => void;
  selectedAppointment: Appointment | null;
  arrivalAppointmentInfo: ArrivalAppointmentInfo | null;
  mainConsentChecked: boolean;
  setMainConsentChecked: (value: boolean) => void;
  biometricConsentChecked: boolean;
  setBiometricConsentChecked: (value: boolean) => void;
  isCameraActive: boolean;
  capturedImageUrl: string | null;
  videoRef: ReturnType<typeof useCamera>["videoRef"];
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => void;
  handleConfirmCheckIn: () => Promise<void>;
  handleDownloadBadge: () => Promise<void>;
  todayLabel: string;
  checkInLoading: boolean;
}

const ScheduleContext = createContext<ScheduleControllerValue | null>(null);

function useScheduleControllerState(): ScheduleControllerValue {
  const { reportError } = useErrorDialog();
  const { isAuthenticated, currentUserName, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(false);

  const {
    isCameraActive,
    capturedImageUrl,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();

  const consentCallbacks = useMemo(
    () => ({
      onBiometricConsentDisabled: () => {
        if (isCameraActive) {
          stopCamera();
        }
      },
    }),
    [isCameraActive, stopCamera],
  );

  const {
    mainConsentChecked,
    biometricConsentChecked,
    setMainConsentChecked,
    setBiometricConsentChecked,
    resetConsents,
  } = useConsent(consentCallbacks);

  const todayLabel = useMemo(() => formatTodayLabel(), []);

  useEffect(() => {
    let cancelled = false;

    const fetchAppointments = async () => {
      setAppointmentsLoading(true);
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
            console.warn(
              "[appointments] Nessun appuntamento restituito. Verificare la sorgente dati o il filtro data.",
            );
          }
        }
      } catch (err) {
        console.error("Unable to load appointments", err);
        if (!cancelled) {
          const message = err instanceof Error ? err.message : String(err);
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

  const todaysAppointments = useMemo(() => appointments, [appointments]);

  const filteredAppointments = useMemo(() => {
    let result = todaysAppointments;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((a) => a.visitorName.toLowerCase().includes(term));
    }

    if (selectedEmployeeId) {
      result = result.filter((a) => String(a.hostId) === selectedEmployeeId);
    }

    if (selectedDateFilter) {
      result = result.filter((a) => a.date === selectedDateFilter);
    }

    return [...result];
  }, [todaysAppointments, searchTerm, selectedEmployeeId, selectedDateFilter]);

  const groupedAppointments = useMemo<AppointmentHostGroup[]>(() => {
    const groups = new Map<string, AppointmentHostGroup>();

    filteredAppointments.forEach((appointment) => {
      const hostKey = String(appointment.hostId);
      let group = groups.get(hostKey);
      if (!group) {
        const employeeDetails = employees.find((emp) => String(emp.id) === hostKey);
        group = {
          hostId: hostKey,
          hostName: appointment.hostName,
          department: employeeDetails?.department,
          location: employeeDetails?.location,
          appointments: [],
        };
        groups.set(hostKey, group);
      }
      group.appointments.push(appointment);
    });

    const compareTime = (a: Appointment, b: Appointment) => {
      const timeA = new Date((a.startTime ?? a.expectedAt) ?? 0).getTime();
      const timeB = new Date((b.startTime ?? b.expectedAt) ?? 0).getTime();
      return timeA - timeB;
    };

    return Array.from(groups.values())
      .map((group) => ({
        ...group,
        appointments: [...group.appointments].sort(compareTime),
      }))
      .sort((a, b) => a.hostName.localeCompare(b.hostName, "it-IT"));
  }, [filteredAppointments, employees]);

  const hostOptions = useMemo<HostOption[]>(() => {
    const normalizedEmployees = employees.map((employee) => ({
      id: String(employee.id),
      fullName: employee.fullName || String(employee.id),
    }));

    if (normalizedEmployees.length > 0) {
      return normalizedEmployees;
    }

    const fallbackHostOptions = Array.from(
      appointments.reduce((acc, appointment) => {
        const hostKey = String(appointment.hostId);
        if (!acc.has(hostKey)) {
          acc.set(hostKey, appointment.hostName);
        }
        return acc;
      }, new Map<string, string>()),
    ).map(([id, name]) => ({ id, fullName: name }));

    return fallbackHostOptions;
  }, [employees, appointments]);

  const dateOptions = useMemo(() => {
    const derivedDates = Array.from(new Set(appointments.map((a) => a.date))).filter(Boolean);
    const sourceDateOptions = availableDates.length ? availableDates : derivedDates;
    return [...sourceDateOptions].sort();
  }, [availableDates, appointments]);

  const arrivalAppointmentInfo = useMemo<ArrivalAppointmentInfo | null>(
    () => (selectedAppointment ? mapAppointmentToArrivalInfo(selectedAppointment) : null),
    [selectedAppointment],
  );

  useEffect(() => {
    if (!selectedAppointment) return;
    const stillExists = appointments.some(
      (appointment) => String(appointment.id) === String(selectedAppointment.id),
    );
    if (!stillExists) {
      setSelectedAppointment(null);
    }
  }, [appointments, selectedAppointment]);

  const handleLogout = useCallback(() => {
    logout();
    setSelectedAppointment(null);
    resetConsents();
    setCheckInLoading(false);
    if (isCameraActive) {
      stopCamera();
    }
  }, [logout, resetConsents, isCameraActive, stopCamera]);

  const handleAppointmentClick = useCallback(
    (appointment: Appointment) => {
      resetConsents();
      setSelectedAppointment(appointment);
      startCamera();
    },
    [resetConsents, startCamera],
  );

  const handleCloseArrivalModal = useCallback(() => {
    setSelectedAppointment(null);
    resetConsents();
    if (isCameraActive) {
      stopCamera();
    }
  }, [resetConsents, isCameraActive, stopCamera]);

  const handleConfirmCheckIn = useCallback(async () => {
    if (!selectedAppointment) return;
    if (!mainConsentChecked) {
      reportError("È necessario il consenso al trattamento dati per procedere.", {
        severity: "warning",
        source: "appointments/checkin",
        title: "Consenso obbligatorio",
      });
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
      const response = await fetch(`/api/appointments/checkin/${normalizedAppointmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentToConfirmId: normalizedAppointmentId,
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
  }, [
    selectedAppointment,
    mainConsentChecked,
    reportError,
    biometricConsentChecked,
    capturedImageUrl,
    isCameraActive,
    stopCamera,
  ]);

  const handleDownloadBadge = useCallback(async () => {
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
      });
    } catch (err) {
      console.error("Badge download failed", err);
      reportError(err, {
        source: "appointments/badge",
        title: "Impossibile generare il badge",
      });
    }
  }, [selectedAppointment, capturedImageUrl, todayLabel, reportError]);

  return {
    isAuthenticated,
    currentUserName,
    handleLogout,
    searchTerm,
    setSearchTerm,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedDateFilter,
    setSelectedDateFilter,
    hostOptions,
    dateOptions,
    groupedAppointments,
    appointmentsLoading,
    handleAppointmentClick,
    handleCloseArrivalModal,
    selectedAppointment,
    arrivalAppointmentInfo,
    mainConsentChecked,
    setMainConsentChecked,
    biometricConsentChecked,
    setBiometricConsentChecked,
    isCameraActive,
    capturedImageUrl,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
    handleConfirmCheckIn,
    handleDownloadBadge,
    todayLabel,
    checkInLoading,
  };
}

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const value = useScheduleControllerState();
  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

export function useScheduleController(): ScheduleControllerValue {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useScheduleController must be used within a ScheduleProvider");
  }
  return context;
}

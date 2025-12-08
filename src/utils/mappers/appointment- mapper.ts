import { Appointment, AppointmentStatus, ArrivalAppointmentInfo } from "@/types";
import { safeDateToIso } from "../date-utils";


export function mapAppointmentToArrivalInfo(appointment: Appointment): ArrivalAppointmentInfo {
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


export function mapApiAppointmentRow(row: any): Appointment {
  const startIso = safeDateToIso(row.StartTime ?? row.startTime ?? row.ExpectedAt ?? row.expectedAt);
  const endIso = safeDateToIso(row.EndTime ?? row.endTime ?? row.ExpectedEnd ?? row.expectedEnd);
  const dateValue = row.Date ?? row.date ?? (startIso ? startIso.slice(0, 10) : "");
  const hostId = row.HostId ?? row.hostId ?? row.HostID ?? row.hostID ?? "";
  const arrivalTime = safeDateToIso(row.ArrivalTime ?? row.arrivalTime);
  const departureTime = safeDateToIso(row.DepartureTime ?? row.departureTime);
  const hostNameFromRow = row.HostName ?? row.hostName ?? null;
  const hostName = hostNameFromRow ?? String(hostId || "Host");
  const visitorName = row.VisitorName ?? row.visitorName ?? "Visitore";
  const status = (row.Status ?? row.status ?? "SCHEDULED") as AppointmentStatus;

  return {
    id: row.Id ?? row.id ?? row.ExternalId ?? row.externalId ?? `temp-${Math.random().toString(36).slice(2)}`,
    startTime: startIso ?? row.startTime ?? row.ExpectedAt ?? row.expectedAt ?? "",
    endTime: endIso ?? row.endTime ?? row.ExpectedEnd ?? row.expectedEnd ?? null,
    date: String(dateValue ?? ""),
    expectedAt: startIso ?? row.ExpectedAt ?? row.expectedAt ?? "",
    expectedEnd: (endIso ?? row.ExpectedEnd ?? row.expectedEnd ?? undefined) || undefined,
    hostId: hostId ?? "",
    arrivalTime,
    departureTime,
    hostName,
    visitorId: row.VisitorId ?? row.visitorId ?? null,
    visitorName,
    visitorCompany: row.VisitorCompany ?? row.visitorCompany ?? null,
    purpose: row.Purpose ?? row.purpose ?? null,
    location: row.Location ?? row.location ?? null,
    status,
    deviceId: row.DeviceId ?? row.deviceId ?? null,
    createdAt: safeDateToIso(row.CreatedAt ?? row.createdAt) ?? undefined,
    updatedAt: safeDateToIso(row.UpdatedAt ?? row.updatedAt) ?? undefined,
  };
}
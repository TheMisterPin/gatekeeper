
import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/jsonDb";
import type { AppointmentRecord, AppointmentStatus } from "@/app/api/appointments/route";

export const runtime = "nodejs";

interface AppointmentsDb {
  lastNumericId: number;
  appointments: AppointmentRecord[];
}

interface VisitRecord {
  id: number;
  appointmentId: string; 
  visitorName: string;
  hostName: string;
  location?: string | null;
  checkInTime: string;
  checkOutTime?: string | null;
}

interface VisitsDb {
  lastVisitId: number;
  visits: VisitRecord[];
}

function ensureAppointmentsDb(db: any): AppointmentsDb {
  if (
    typeof db === "object" &&
    db !== null &&
    Array.isArray(db.appointments) &&
    typeof db.lastNumericId === "number"
  ) {
    return db as AppointmentsDb;
  }

  return {
    lastNumericId: 0,
    appointments: [],
  };
}

function ensureVisitsDb(db: any): VisitsDb {
  if (
    typeof db === "object" &&
    db !== null &&
    Array.isArray(db.visits) &&
    typeof db.lastVisitId === "number"
  ) {
    return db as VisitsDb;
  }

  return {
    lastVisitId: 0,
    visits: [],
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const appointmentId = params.id;

  const [appointmentsRaw, visitsRaw] = await Promise.all([
    readJsonFile<AppointmentsDb>("appointments.json", {
      lastNumericId: 0,
      appointments: [],
    }),
    readJsonFile<VisitsDb>("visits.json", {
      lastVisitId: 0,
      visits: [],
    }),
  ]);

  const appointmentsDb = ensureAppointmentsDb(appointmentsRaw);
  const visitsDb = ensureVisitsDb(visitsRaw);

  const appointment = appointmentsDb.appointments.find(
    (a) => a.id === appointmentId
  );

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    );
  }

  // If already checked in, reuse existing visit if present
  const now = new Date().toISOString();

  if (appointment.status === "checkedIn") {
    const existingVisit = visitsDb.visits.find(
      (v) => v.appointmentId === appointmentId && !v.checkOutTime
    );
    return NextResponse.json({
      appointment,
      visit: existingVisit ?? null,
    });
  }

  appointment.status = "checkedIn" as AppointmentStatus;

  const newVisitId = visitsDb.lastVisitId + 1;

  const visit: VisitRecord = {
    id: newVisitId,
    appointmentId: appointment.id,
    visitorName: appointment.visitorName,
    hostName: appointment.hostName,
    location: appointment.location,
    checkInTime: now,
    checkOutTime: null,
  };

  visitsDb.lastVisitId = newVisitId;
  visitsDb.visits.push(visit);

  await Promise.all([
    writeJsonFile("appointments.json", appointmentsDb),
    writeJsonFile("visits.json", visitsDb),
  ]);

  return NextResponse.json({
    appointment,
    visit,
  });
}

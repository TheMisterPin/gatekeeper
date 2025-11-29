
import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/jsonDb";
import { Appointment, AppointmentStatus } from "@/types";

export const runtime = "nodejs";



interface AppointmentsDb {
  lastNumericId: number;
  appointments: Appointment[];
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

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const status = url.searchParams.get("status") as AppointmentStatus | null;

  const raw = await readJsonFile<AppointmentsDb>("appointments.json", {
    lastNumericId: 0,
    appointments: [],
  });
  const db = ensureAppointmentsDb(raw);

  let list = db.appointments;

  if (date) {
    list = list.filter((a) => a.date === date);
  }

  if (status) {
    list = list.filter((a) => a.status === status);
  }

  // sort by hostName, then expectedAt
  list = [...list].sort((a, b) => {
    const hostCmp = a.hostName.localeCompare(b.hostName, "it-IT");
    if (hostCmp !== 0) return hostCmp;
    return a.expectedAt.localeCompare(b.expectedAt);
  });

  return NextResponse.json({ appointments: list });
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const date = String(body?.date ?? "").trim();
  const expectedAt = String(body?.expectedAt ?? "").trim();
  const hostId = String(body?.hostId ?? "").trim();
  const hostName = String(body?.hostName ?? "").trim();
  const visitorName = String(body?.visitorName ?? "").trim();
  const visitorCompany =
    body?.visitorCompany != null ? String(body.visitorCompany) : null;
  const purpose =
    body?.purpose != null ? String(body.purpose) : null;
  const location =
    body?.location != null ? String(body.location) : null;

  if (!date || !expectedAt || !hostId || !hostName || !visitorName) {
    return NextResponse.json(
      {
        error:
          "date, expectedAt, hostId, hostName and visitorName are required",
      },
      { status: 400 }
    );
  }

  const raw = await readJsonFile<AppointmentsDb>("appointments.json", {
    lastNumericId: 0,
    appointments: [],
  });
  const db = ensureAppointmentsDb(raw);

  const nextNumericId = db.lastNumericId + 1;
  const newId = `A${String(nextNumericId).padStart(3, "0")}`;

  const record: Appointment = {
    id: newId,
    date,
    expectedAt,
    startTime: expectedAt, 
    expectedEnd: body?.expectedEnd ?? null,
    hostId,
    hostName,
    visitorName,
    visitorCompany,
    visitorId: body?.visitorId ?? null,
    purpose,
    location,
    status: "SCHEDULED",
  };

  db.lastNumericId = nextNumericId;
  db.appointments.push(record);

  await writeJsonFile("appointments.json", db);

  return NextResponse.json(record, { status: 201 });
}

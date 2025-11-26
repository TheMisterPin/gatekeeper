
import { NextRequest, NextResponse } from "next/server";
import { readJsonFile } from "@/lib/jsonDb";

export const runtime = "nodejs";

type AppointmentStatus =
  | "scheduled"
  | "checkedIn"
  | "completed"
  | "cancelled"
  | "noShow";

interface AppointmentRecord {
  id: string;
  date: string;
  expectedAt: string;
  expectedEnd?: string | null;
  hostId: string;
  hostName: string;
  visitorName: string;
  visitorCompany?: string | null;
  knownSuspectId?: string | null;
  purpose?: string | null;
  location?: string | null;
  status: AppointmentStatus;
}

interface AppointmentsDb {
  lastNumericId: number;
  appointments: AppointmentRecord[];
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

function toCsvValue(value: unknown): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    // escape quotes by doubling them
    const escaped = str.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");

  const raw = await readJsonFile<AppointmentsDb>("appointments.json", {
    lastNumericId: 0,
    appointments: [],
  });
  const db = ensureAppointmentsDb(raw);

  let list = db.appointments;
  if (date) {
    list = list.filter((a) => a.date === date);
  }

  // sort by hostName then expectedAt
  list = [...list].sort((a, b) => {
    const hostCmp = a.hostName.localeCompare(b.hostName, "it-IT");
    if (hostCmp !== 0) return hostCmp;
    return a.expectedAt.localeCompare(b.expectedAt);
  });

  const header = [
    "ID",
    "Date",
    "Time",
    "HostId",
    "HostName",
    "VisitorName",
    "VisitorCompany",
    "Location",
    "Purpose",
    "Status",
  ];

  const lines: string[] = [];
  lines.push(header.join(","));

  for (const a of list) {
    const datePart = a.date;
    const timePart =
      a.expectedAt.length >= 16
        ? a.expectedAt.slice(11, 16)
        : a.expectedAt;

    const row = [
      toCsvValue(a.id),
      toCsvValue(datePart),
      toCsvValue(timePart),
      toCsvValue(a.hostId),
      toCsvValue(a.hostName),
      toCsvValue(a.visitorName),
      toCsvValue(a.visitorCompany ?? ""),
      toCsvValue(a.location ?? ""),
      toCsvValue(a.purpose ?? ""),
      toCsvValue(a.status),
    ];
    lines.push(row.join(","));
  }

  const csv = lines.join("\r\n");
  const fileName = date ? `appointments-${date}.csv` : "appointments.csv";

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}

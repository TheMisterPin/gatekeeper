
import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/jsonDb";

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
  visitorId?: string | null;
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

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => line.split(","));

  return { headers, rows };
}

function getCell(
  headers: string[],
  row: string[],
  columnName: string
): string | null {
  const idx = headers.findIndex(
    (h) => h.toLowerCase() === columnName.toLowerCase()
  );
  if (idx === -1 || idx >= row.length) return null;
  return row[idx].replace(/^"|"$/g, "").trim();
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json(
      { error: "File CSV mancante (campo 'file')." },
      { status: 400 }
    );
  }

  const text = await file.text();
  const { headers, rows } = parseCsv(text);

  if (headers.length === 0) {
    return NextResponse.json(
      { error: "File CSV vuoto o intestazioni mancanti." },
      { status: 400 }
    );
  }

  let raw = await readJsonFile<AppointmentsDb>("appointments.json", {
    lastNumericId: 0,
    appointments: [],
  });
  const db = ensureAppointmentsDb(raw);

  let imported = 0;
  let skipped = 0;

  for (const row of rows) {
    const date = getCell(headers, row, "Date");
    const time = getCell(headers, row, "Time");
    const hostId = getCell(headers, row, "HostId");
    const hostName = getCell(headers, row, "HostName");
    const visitorName = getCell(headers, row, "VisitorName");

    if (!date || !time || !hostId || !hostName || !visitorName) {
      skipped++;
      continue;
    }

    const visitorCompany = getCell(headers, row, "VisitorCompany");
    const location = getCell(headers, row, "Location");
    const purpose = getCell(headers, row, "Purpose");

    const expectedAt = `${date}T${time.length === 5 ? time : time.slice(0, 5)}:00`;

    const nextNumericId = db.lastNumericId + 1;
    const newId = `A${String(nextNumericId).padStart(3, "0")}`;

    const record: AppointmentRecord = {
      id: newId,
      date,
      expectedAt,
      expectedEnd: null,
      hostId,
      hostName,
      visitorName,
      visitorCompany: visitorCompany || null,
      visitorId: null,
      purpose: purpose || null,
      location: location || null,
      status: "scheduled",
    };

    db.lastNumericId = nextNumericId;
    db.appointments.push(record);
    imported++;
  }

  await writeJsonFile("appointments.json", db);

  return NextResponse.json({
    imported,
    skipped,
  });
}

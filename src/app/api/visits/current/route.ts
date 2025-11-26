
import { NextRequest, NextResponse } from "next/server";
import { readJsonFile } from "@/lib/jsonDb";

export const runtime = "nodejs";

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

export async function GET(req: NextRequest) {
  const raw = await readJsonFile<VisitsDb>("visits.json", {
    lastVisitId: 0,
    visits: [],
  });

  const db = ensureVisitsDb(raw);

  const openVisits = db.visits.filter((v) => !v.checkOutTime);

  return NextResponse.json({ visits: openVisits });
}

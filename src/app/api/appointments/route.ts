/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserByID } from "@/utils/db/users/get-user";


export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Support date passed either as a query param or in the request body
  const url = new URL(req.url);
  let date: string | null = url.searchParams.get("date");
  if (!date) {
    try {
      const body = await req.json();
      date = body?.date ?? null;
    } catch {
      date = null;
    }
  }

  const where: any = { Status: "SCHEDULED" };
  if (date) {
    // Expecting an ISO date or date string that can be compared to StartTime
    where.StartTime = new Date(date);
  }

  const list = await prisma.vIS_VisitAppointment.findMany({ where });

  return NextResponse.json({ appointments: list });
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  // Map incoming shape to Prisma model fields and validate
  if (!body.startTime || !body.hostId) {
    return NextResponse.json({ error: "Missing required fields: startTime and hostId" }, { status: 400 });
  }

  const data: any = {
    StartTime: new Date(body.startTime),
    HostId: body.hostId,
    VisitorId: body.visitorId ?? null,
    VisitorName: body.visitorName ?? String(body.visitorId ?? "Unknown Visitor"),
    Location: body.location ?? null,
    Purpose: body.purpose ?? null ,
  };

  if (body.endTime) data.EndTime = new Date(body.endTime);

  try {
    const record = await prisma.vIS_VisitAppointment.create({ data });
    return NextResponse.json(record, { status: 201 });
  } catch (err: any) {
    // Return the error message for easier debugging in dev
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}

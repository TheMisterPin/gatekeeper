/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Employee } from "@/types"

export const runtime = "nodejs"

function getDateRange(dateString: string) {
  const parsed = new Date(dateString)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  const start = new Date(parsed)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start, end }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const statusParam = url.searchParams.get("status")
  let dateParam: string | null = url.searchParams.get("date")

  if (!dateParam) {
    try {
      const body = await req.json()
      dateParam = body?.date ?? null
    } catch {
      dateParam = null
    }
  }

  const where: Record<string, unknown> = {}

  if (statusParam && statusParam.toUpperCase() !== "ALL") {
    where.Status = statusParam
  } else if (!statusParam) {
    where.Status = "SCHEDULED"
  }

  if (dateParam) {
    const range = getDateRange(dateParam)
    if (!range) {
      return NextResponse.json({ error: "Invalid date parameter" }, { status: 400 })
    }
    where.StartTime = { gte: range.start, lt: range.end }
  }

  try {
    const list = await prisma.vIS_VisitAppointment.findMany({
      where,
      orderBy: { StartTime: "asc" },
    })
    const employeeMap = new Map<string, Employee>()
    const dateSet = new Set<string>()

    for (const appointment of list) {
      if (appointment.StartTime) {
        dateSet.add(appointment.StartTime.toISOString().slice(0, 10))
      }

      const hostId = appointment.HostId?.toString().trim()
      if (hostId && !employeeMap.has(hostId)) {
        employeeMap.set(hostId, {
          id: hostId,
          fullName: appointment.HostName ?? hostId,
          role: undefined,
          department: undefined,
          location: undefined,
        })
      }
    }

    const employees = Array.from(employeeMap.values()).sort((a, b) => a.fullName.localeCompare(b.fullName, "it-IT"))
    const dates = Array.from(dateSet.values()).sort()

    return NextResponse.json({ appointments: list, employees, dates })
  } catch (err) {
    console.error("Unable to query appointments", err)
    const message = err instanceof Error ? err.message : "Unknown database error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
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

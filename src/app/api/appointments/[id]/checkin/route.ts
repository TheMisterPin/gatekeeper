
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { confirmArrival } from '@/lib/appointments/confirm-arrival';

export const runtime = "nodejs"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const appointmentIdRaw = params.id?.trim()
  if (!appointmentIdRaw) {
    return NextResponse.json({ error: "Invalid appointment id" }, { status: 400 })
  }

  let resolvedId: number | null = null
  const numericCandidate = Number(appointmentIdRaw)
  if (Number.isFinite(numericCandidate)) {
    resolvedId = numericCandidate
  } else {
    try {
      const match = await prisma.vIS_VisitAppointment.findFirst({
        where: { ExternalId: appointmentIdRaw },
        select: { Id: true },
      })
      if (match) {
        resolvedId = match.Id
      }
    } catch (lookupError) {
      console.error("Unable to resolve appointment by external id", lookupError)
    }
  }

  if (resolvedId === null) {
    console.warn("Check-in rejected: unresolved appointment id", { appointmentIdRaw })
    return NextResponse.json({ error: "Invalid appointment id" }, { status: 400 })
  }

  try {
    const appointment = await confirmArrival(resolvedId)
    return NextResponse.json({ message: "Check-in successful", appointment })
  } catch (err: unknown) {
    console.error("Unable to confirm arrival", err)
    const isRecordMissing = typeof err === "object" && err !== null && "code" in err && (err as any).code === "P2025"
    const status = isRecordMissing ? 404 : 500
    const message = err instanceof Error ? err.message : "Unable to confirm arrival"
    return NextResponse.json({ error: message }, { status })
  }
}

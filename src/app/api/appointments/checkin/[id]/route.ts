
import { NextRequest, NextResponse } from "next/server"
import { confirmArrival } from "@/lib/appointments/confirm-arrival"


export const runtime = "nodejs"

export async function POST(
  req: NextRequest,
 
) {
const body = await req.json()
const appointmentId = body?.appointmentToConfirmId

  try {
    const appointment = await confirmArrival(appointmentId)
    return NextResponse.json({ message: "Check-in successful", appointment })
  } catch (err: unknown) {
    console.error("Unable to confirm arrival", err)
    const isRecordMissing = typeof err === "object" && err !== null && "code" in err && (err as any).code === "P2025"
    const status = isRecordMissing ? 404 : 500
    const message = err instanceof Error ? err.message : "Unable to confirm arrival"
    return NextResponse.json({ error: message }, { status })
  }
}

import type { AppointmentStatus } from "@/types/appointments"
import { prisma } from "../prisma"

const CHECKED_IN_STATUS: AppointmentStatus = "CHECKED_IN"

export async function confirmArrival(appointmentId: number) {
    const updatedAppointment = await prisma.vIS_VisitAppointment.update({
        where: { Id: appointmentId },
        data: {
            Status: CHECKED_IN_STATUS,
            UpdatedAt: new Date(),
        },
    })

    return updatedAppointment
}
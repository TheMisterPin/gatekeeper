import { CreateAppointmentFormData } from "@/types/form-data/create-appointment";
import { prisma } from "../prisma";
import { getVisitorDetails } from "../visitors/visitors";

export async function createAppointment(data : CreateAppointmentFormData) {
const visitor = await getVisitorDetails(data.visitorId);
if (!visitor) {
    throw new Error("Visitor not found");
}

const newAppointment = await prisma.vIS_VisitAppointment.create({
    data: {
    StartTime: data.startTime,
    EndTime: data.endTime,
    VisitorId: data.visitorId,
    HostId: data.hostId,
    Status: "SCHEDULED",
    Location: data.location,
    VisitorName: visitor.name!,
    VisitorCompany: visitor.company,
    }
});

return newAppointment;
}


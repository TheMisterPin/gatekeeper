import { getRandomDate } from '@/utils/get-random-date';
import { CreateAppointmentFormData } from "@/types/form-data/create-appointment";

const visitorsIds = [
    "VIS-0001",
    "VIS-0002",
    "VIS-0003",
    "VIS-0004",
    "VIS-0005",
    "VIS-0006",
    "VIS-0007",
    "VIS-0008",
    "VIS-0009",
    "VIS-0010",
    "VIS-0011",
    "VIS-0012",
    "VIS-0013",
    "VIS-0014",
    "VIS-0015",
    "VIS-0016",
    "VIS-0017",
    "VIS-0018",
    "VIS-0019",
    "VIS-0020",
];

const hostIds = [
    "IMP-1001",
    "IMP-1002",
    "IMP-1003",
    "IMP-1004",
    "IMP-1005",
    "IMP-1006",
    "IMP-1007",
    "IMP-1008",
    "IMP-1009",
    "IMP-1010",
];

const randomVisitor = () => visitorsIds[Math.floor(Math.random() * visitorsIds.length)];
const randomHost = () => hostIds[Math.floor(Math.random() * hostIds.length)];

// Client-safe mock generator: does not call server-side DB or Prisma.
export async function generateMockAppointments(count: number) {
    const appointments: CreateAppointmentFormData[] = [];
    for (let i = 0; i < count; i++) {
        const host = randomHost();
        const visitor = randomVisitor();

        // generate a random date within next 7 days
        const start = new Date();
        const end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        

        const newAppointment: CreateAppointmentFormData = {
            hostId: host,
            visitorId: visitor,
            startTime: start,
            endTime: end,
        };
        appointments.push(newAppointment);
    }
    return appointments;
}
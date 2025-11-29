import { prisma } from "@/lib/prisma";
import { getRandomDate } from "@/utils/get-random-date";

const resources = await prisma.ePS_Resource.findMany()
const visitor = await prisma.rEM_Contact.findMany({where: {TypeID: 3}})
const getRandomResource = () => {
    const randomIndex = Math.floor(Math.random() * resources.length);
    return resources[randomIndex];
}
const getRandomVisitor = () => {
    const randomIndex = Math.floor(Math.random() * visitor.length);
    return visitor[randomIndex];
}
const start = new Date("2025-11-26T00:00:00");
const end   = new Date("2025-11-30T23:59:59");

const createNewAppointment = () => {
    const randomDate = getRandomDate(start, end);
    const resource = getRandomResource();
    const visitor = getRandomVisitor();
    const newAppointment = {
        Location: resource.CustString2 ?? "Ufficio Centrale",
        VisitorName: visitor.Name ?? "Visitatore Sconosciuto",
        HostId : resource.ResourceID,
        VisitorId: visitor.ID,
        StartTime: randomDate
}    
return prisma.vIS_VisitAppointment.create({ data: newAppointment });}
async function generate(quantity : number){
  for (let i = 0; i < quantity; i++) {
    await createNewAppointment();
}
}
interface RandomAppointmentRequest {
    quantity: number;
}

export async function POST(request: Request) {
  const body : RandomAppointmentRequest = await request.json();
  await generate(body.quantity);    
  return new Response(`Generated ${body.quantity} appointments`);
}
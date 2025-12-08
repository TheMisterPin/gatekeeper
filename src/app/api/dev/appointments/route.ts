import { prisma } from "@/lib/prisma";


async function fixAppointmentNames() {
    const appointments = await prisma.vIS_VisitAppointment.findMany({where: {HostName: null}})
const hosts = await prisma.ePS_Resource.findMany()
// update hostname in appointments with name + surname from hosts
const hostMap = new Map(hosts.map(h => [h.ResourceID, `${h.FirstName} ${h.LastName}`.trim()]))

appointments.map(async (app) => {
  const hostName = hostMap.get(app.HostId);
  if (hostName) {
    return prisma.vIS_VisitAppointment.update({
      where: { Id: app.Id },
      data: { HostName: hostName }
    });
  }
});
    
}
async function fixCompanyNames(){
    const appointments = await prisma.vIS_VisitAppointment.findMany({where: {VisitorCompany: null}})
    const visitors = await prisma.rEM_Contact.findMany()
    const visitorMap = new Map(visitors.map(v => [v.ID, v.CustString1]))
    appointments.map(async (app) => {
      const companyName = visitorMap.get(app.VisitorId!);
      if (companyName) {
        return prisma.vIS_VisitAppointment.update({
          where: { Id: app.Id },
          data: { VisitorCompany: companyName }
        });
      }
    });
}

async function fixVisitorNames() {
const appointments = await prisma.vIS_VisitAppointment.findMany();

const visitors = await prisma.rEM_Contact.findMany();

const visitorMap = new Map(visitors.map(v => [v.ID, `${v.Name}`.trim()]));

appointments.map(async (app) => {

    const visitorName = visitorMap.get(app.VisitorId!);

    if (visitorName) {

        return prisma.vIS_VisitAppointment.update({

            where: { Id: app.Id },

            data: { VisitorName: visitorName }

        });

    }

});

}


export async function POST() {

await fixAppointmentNames();
await fixCompanyNames();
await fixVisitorNames();

return Response.json({ success: true });
}

export async function DELETE() {
  const allAppointments = await prisma.vIS_VisitAppointment.findMany();
  const deletePromises = allAppointments.map(appointment =>
    prisma.vIS_VisitAppointment.delete({
      where: { Id: appointment.Id }
    })
  );
  const results = await Promise.all(deletePromises);
  const deleted = results.length;
  return Response.json({ success: true, "deleted": deleted });
}
import { get } from "http";
import { prisma } from "../prisma";

export async function getVisitors() {
    const visitors = await prisma.rEM_Contact.findMany({where: {TypeID: 3}});
    return visitors;
}

export async function getVisitorById(id: string) {
    const visitor = await prisma.rEM_Contact.findFirst({where: {ID: id, TypeID: 3}});
    return visitor;
}
export async function getVisitorDetails(id: string) {
const visitor = await getVisitorById(id);
if (!visitor){
    return null;

}
const details = { name: visitor.Name, company: visitor.CustString1, id : visitor.ID  }
return details;
}

import { prisma } from "@/lib/prisma";

export async function userExists (userID : string ) {
 const user=    await prisma.ePS_Resource.findUnique({
        where: {
            ResourceID: userID
        }
    });
    if (user) {
        return true;
    }
    return false;}
export async function userNameExists(userName: string) {
const user = await prisma.ePS_Resource.findFirst({
        where: {
            USLogin: userName
        }
    });
    
    if (user) {
        return true;
    }
    return false;
}

export async function getUserByID(userID: string) {
   const user = await prisma.ePS_Resource.findUnique({
        where: {
            ResourceID: userID
        }
    });
    return user;
}
export async function getUserByUserName(userName: string) {
    return await prisma.ePS_Resource.findFirst({
        where: {
            USLogin: userName
        }
    });
}
export async function getUserFullName(userID: string) {
    const user = await getUserByID(userID);
    if (user) {
        return `${user.FirstName} ${user.LastName}`;
    }
    return null;
}
export async function login (username: string, password: string) {
 
}
export async function getUser(userID: string) {
    prisma.ePS_Resource.findUnique({
         where: {
            ResourceID : userID
            }
            })}



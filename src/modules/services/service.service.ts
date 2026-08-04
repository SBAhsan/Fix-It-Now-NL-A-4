import { prisma } from "../../lib/prisma";

const getAllServicesFromDB = async() => {
    const result = await prisma.service.findMany({
        where: {
            isActive: true
        },

        include: {
            technician: true
        }
    });

    return result;
}

export const serviceService = {
    getAllServicesFromDB
}
import { prisma } from "../../lib/prisma";
import { ICreateTechnicianProfile } from "./technician.interface";

const createTechnicianProfileInDB = async (userId: string, payload: ICreateTechnicianProfile) => {
    const {bio, skills, experienceYears, city} = payload;

    const createdProfile = await prisma.technicianProfile.create({
        data: {
            userId,
            bio,
            skills,
            experienceYears,
            city
        }
    });

    const result = await prisma.technicianProfile.findUnique({
        where:{
            userId
        }
    });

    return result;
};


export const technicianService = {
    createTechnicianProfileInDB
}
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

const getAllProfileFromDB = async () => {
    const profiles = await prisma.technicianProfile.findMany();

    return profiles;
}

const getSingleProfileFromDB = async (profileId: string) => {
    
    const profile = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            id: profileId
        },
        include: {
            reviews: true
        }
    })

    return profile;
}

const deleteOwnProfileInDB = async (userId: string) => {
    await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            userId
        }
    })

    const result = await prisma.technicianProfile.delete({
        where: {
            userId
        }
    });

    return result;
};

const deleteTechnicianProfileInDB = async (profileId: string) => {

    const profile = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            id: profileId
        }
    })

    console.log(profile);
    const result = await prisma.technicianProfile.delete({
        where: {
            id: profileId
        }
    });

    return result;
}

export const technicianService = {
    createTechnicianProfileInDB,
    getAllProfileFromDB,
    getSingleProfileFromDB,
    deleteOwnProfileInDB,
    deleteTechnicianProfileInDB
}
import { prisma } from "../../lib/prisma";
import { ICreateCategoryPayload } from "./admin.interface";

const createCategoryInDB = async (payload: ICreateCategoryPayload) => {
    const {name, description, isActive} = payload;

    const doCategoryExist = await prisma.category.findUnique({
        where: {
            name
        }
    })

    if(doCategoryExist) {
        throw new Error ("Category already exists");
    }

    await prisma.category.create({
        data: {
            name,
            description,
            isActive
        }
    })

    const result = await prisma.category.findUnique({
        where: {
            name
        }
    });

    return result;
};

export const adminService = {
    createCategoryInDB
}
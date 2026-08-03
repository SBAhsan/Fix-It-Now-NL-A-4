import { UserStatus } from "../../../prisma/generated/prisma/enums"

export interface ICreateCategoryPayload {
    name: string,
    description: string,
    isActive: boolean
}

export interface IUpdateUser {
    status: UserStatus
}
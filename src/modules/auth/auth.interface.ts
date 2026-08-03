import { UserRole, UserStatus } from "../../../prisma/generated/prisma/enums";

export interface IUserRegisterPayload {
    name: string,
    email: string,
    password: string,
    phone: string,
    role?: UserRole,
    status?: UserStatus
}

export interface ILoginUser {
    email: string,
    password: string
}
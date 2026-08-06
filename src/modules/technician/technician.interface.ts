import { BookingStatus } from "../../../prisma/generated/prisma/enums";

export interface ICreateTechnicianProfile {
  bio?: string;
  skills: string[];
  experienceYears: number;
  city: string;
}


export interface ICreateAvailableSlotPayload {
  slotDate: string;
  slotTime: string;
  isBooked: boolean;
}

export interface IUpdateAvailableSlotPayload {
  id: string;
  slotDate?: string;
  slotTime?: string;
}

export interface IUpdateBookingStatusPayload {
    status: BookingStatus
}

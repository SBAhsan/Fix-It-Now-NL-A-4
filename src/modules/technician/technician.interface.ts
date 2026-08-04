export interface ICreateTechnicianProfile {
  bio?: string;
  skills: string[];
  experienceYears: number;
  city: string;
}

export interface ICreateServicePayload {
  title: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryId: string;
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

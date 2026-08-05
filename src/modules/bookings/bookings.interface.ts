export interface ICreateBookingPayload {
  technicianId: string;
  serviceIds: string[];
  slotId: string;
  scheduledDate: string;
  scheduledTime: string;
  workAddress: string;
}

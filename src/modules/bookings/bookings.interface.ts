export interface ICreateBookingPayload {
  technicianId: string;
  serviceId: string;
  slotId: string;
  scheduledDate: string;
  scheduledTime: string;
  workAddress: string;
}

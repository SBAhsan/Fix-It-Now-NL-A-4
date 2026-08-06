export interface ICreateServicePayload {
  title: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryId: string;
}
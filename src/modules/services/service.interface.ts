import { ServiceWhereInput } from "../../../prisma/generated/prisma/models";

export interface ICreateServicePayload {
  title: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryId: string;
}

export interface IServiceQuery extends ServiceWhereInput {
  searchItem?: string;
  categoryId?: string;
  location?: string;
  rating?: number;
}

import { TechnicianProfileWhereInput } from "../../../prisma/generated/prisma/models";

export interface IQueryTechnician extends TechnicianProfileWhereInput {
  searchItem?: string;
  skill?: string;
  minRating?: number;
}

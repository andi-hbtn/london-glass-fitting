import { CategoryEntity } from "../entity/category.entity";

export interface CategoryResponse {
  statusCode: number;
  message: string;
  data: CategoryEntity;
}


export interface DeleteCategoryResponse{
  statusCode:200,
  message:string,
}
import { ProductEntity } from "../entity/products.entity";
import { ProductColorVariant } from "../entity/productColorVariants.entity";

export interface ProductResponse {
  status: number;
  message: string;
  data: ProductEntity;
}

export interface AllProductResponse {
  status: number;
  message: string;
  data: ProductEntity[];
}

export interface DeleteProductResponse {
  status: number,
  message: string,
}


export interface DeleteProductVariantResponse {
  status: number,
  message: string,
}
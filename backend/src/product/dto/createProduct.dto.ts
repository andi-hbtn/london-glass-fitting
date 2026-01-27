// src/product/dto/create-product.dto.ts
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductVariantDto } from './productVariant.dto';

export class CreateProductDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto) 
    productVariants: ProductVariantDto[];
}

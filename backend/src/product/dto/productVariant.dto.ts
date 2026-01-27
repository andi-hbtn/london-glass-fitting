// src/product/dto/product-variant.dto.ts
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ProductVariantDto {
    @IsString()
    colorName: string;

    @Type(() => Number)
    @IsNumber()
    price: number;

    @Type(() => Number)
    @IsNumber()
    stock: number;

    @IsString()
    reference: string;

    @IsOptional() // Optional if not all variants have images
    @IsString()
    color_image?: string;

    @IsOptional() // Optional if not all variants have images
    @IsString()
    product_color_image?: string;
}

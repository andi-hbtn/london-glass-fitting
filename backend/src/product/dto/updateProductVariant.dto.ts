import { Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductVariantDto {

    @IsString()
    color: string;

    @Type(() => Number)
    @IsNumber()
    price: number;

    @Type(() => Number)
    @IsNumber()
    stock: number;

    @IsString()
    reference: string;

    @IsOptional()
    @IsString()
    color_image?: string;

    @IsOptional()
    @IsString()
    main_image?: string;
}

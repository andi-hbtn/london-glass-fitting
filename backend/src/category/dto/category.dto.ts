import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty } from "class-validator";

export class CategoryDto {
	@Transform(({ value }) => (value === 'undefined' ? '' : value?.trim()))
	@IsString()
	@IsNotEmpty({ message: 'Title is required' })
	title: string;
}
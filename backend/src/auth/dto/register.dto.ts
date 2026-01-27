import { IsNotEmpty, IsString, IsEmail, IsOptional } from "class-validator";

export class RegisterDto {

    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsNotEmpty()
    @IsString()
    lastname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    country: string;

    @IsOptional()
    town: string;

    @IsOptional()
    zipCode: string;

    @IsOptional()
    appartment: string;

    @IsOptional()
    message: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    createdAt: Date
}
import { IsString, IsNotEmpty, IsEmail, Length } from "class-validator";

export class ContactDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    fullname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    postal_code: string;

    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    subject: string;

    @IsString()
    @IsNotEmpty()
    @Length(10, 1000)
    message: string;
}
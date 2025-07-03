import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateBuyerUserDto {

    @IsString()
    @IsNotEmpty()
    name:string;

    @IsString()
    @IsNotEmpty()
    last_name:string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    user_image:string;

    @IsString()
    @IsNotEmpty()
    cellphone_number:string;

    @IsBoolean()
    @IsNotEmpty()
    verified:boolean;

}

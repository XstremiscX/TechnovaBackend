import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBuyerUserDto {
    
    @IsString()
    @IsNotEmpty()
    user_name: string;

    @IsString()
    @IsNotEmpty()
    user_lastname: string;

    @IsString()
    @IsNotEmpty()
    user_password: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    user_image?: string;

    @IsString()
    @IsNotEmpty()
    cellphone_number: string;


}

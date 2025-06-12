import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSellerUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    seller_name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    company_name?: string;
    
    @IsString()
    @IsNotEmpty()
    address: string;
    
    @IsString()
    @IsNotEmpty()
    user_password: string;
    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    user_image?: string;
    
    @IsString()
    @IsNotEmpty() 
    cellphone_number: string;
    
    @IsDate()
    @IsNotEmpty()
    @IsOptional()
    registration_date?: Date;
    
    @IsNumber()
    @IsNotEmpty()
    user_type: number; // 0 para persona, 1 para empresa
}

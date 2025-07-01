import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    brand_id: string;

    @IsString()
    @IsNotEmpty()
    category_id: string;

    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
    
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    product_image: string;

    @IsString()
    @IsNotEmpty()
    product_status: string;

}

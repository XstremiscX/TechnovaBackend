import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateSalesDetailDto {

    @IsString()
    @IsNotEmpty()
    product_id: string;
    
    @IsString()
    @IsNotEmpty()
    unite_price: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

}
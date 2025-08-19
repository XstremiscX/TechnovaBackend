import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSaleDto {

    @IsString()
    @IsNotEmpty()
    buyer_id: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

}

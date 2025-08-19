import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateCardDto{

    @IsString()
    @IsNotEmpty()
    card_number: string;

    @IsString()
    @IsNotEmpty()
    expiration_date: string;

    @IsString()
    @IsNotEmpty()
    card_holder: string;

}
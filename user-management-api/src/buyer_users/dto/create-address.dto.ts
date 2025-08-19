import { IsNotEmpty, IsString } from "class-validator";

export class CreatAddressDto{

    @IsString()
    @IsNotEmpty()
    address: string;

}
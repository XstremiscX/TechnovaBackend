import { PartialType } from "@nestjs/mapped-types";
import { CreatAddressDto } from "./create-address.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAddressDto extends PartialType(CreatAddressDto){

    @IsString()
    @IsNotEmpty()
    address_id: string;

}
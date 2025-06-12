import { OmitType } from '@nestjs/mapped-types';
import { CreateSellerUserDto } from './create-seller_user.dto';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class UpdateSellerUserDto extends OmitType(CreateSellerUserDto, ['user_password']) {

}

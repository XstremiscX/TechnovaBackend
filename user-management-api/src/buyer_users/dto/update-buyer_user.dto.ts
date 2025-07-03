import { PartialType } from '@nestjs/mapped-types';
import { CreateBuyerUserDto } from './create-buyer_user.dto';

export class UpdateBuyerUserDto extends PartialType(CreateBuyerUserDto) {}

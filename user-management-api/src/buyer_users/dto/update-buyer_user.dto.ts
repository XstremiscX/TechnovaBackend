import { OmitType } from '@nestjs/mapped-types';
import { CreateBuyerUserDto } from './create-buyer_user.dto';

export class UpdateBuyerUserDto extends OmitType(CreateBuyerUserDto,['user_password']) {

    

}

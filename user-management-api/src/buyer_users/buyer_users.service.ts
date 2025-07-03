import { Injectable } from '@nestjs/common';
import { CreateBuyerUserDto } from './dto/create-buyer_user.dto';
import { UpdateBuyerUserDto } from './dto/update-buyer_user.dto';

@Injectable()
export class BuyerUsersService {
  create(createBuyerUserDto: CreateBuyerUserDto) {
    return 'This action adds a new buyerUser';
  }

  findAll() {
    return `This action returns all buyerUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} buyerUser`;
  }

  update(id: number, updateBuyerUserDto: UpdateBuyerUserDto) {
    return `This action updates a #${id} buyerUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} buyerUser`;
  }
}

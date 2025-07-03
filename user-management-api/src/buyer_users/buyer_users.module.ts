import { Module } from '@nestjs/common';
import { BuyerUsersService } from './buyer_users.service';
import { BuyerUsersController } from './buyer_users.controller';

@Module({
  controllers: [BuyerUsersController],
  providers: [BuyerUsersService],
})
export class BuyerUsersModule {}

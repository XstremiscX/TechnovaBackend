import { Module } from '@nestjs/common';
import { SellerUsersService } from './seller_users.service';
import { SellerUsersController } from './seller_users.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [SellerUsersController],
  imports: [DatabaseModule],
  providers: [SellerUsersService],
})
export class SellerUsersModule {}

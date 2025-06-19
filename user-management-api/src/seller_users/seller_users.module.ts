import { Module } from '@nestjs/common';
import { SellerUsersService } from './seller_users.service';
import { SellerUsersController } from './seller_users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [SellerUsersController],
  imports: [DatabaseModule,JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' }})],
  providers: [SellerUsersService]
})
export class SellerUsersModule {}

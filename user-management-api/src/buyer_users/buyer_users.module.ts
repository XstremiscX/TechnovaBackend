import { Module } from '@nestjs/common';
import { BuyerUsersService } from './buyer_users.service';
import { BuyerUsersController } from './buyer_users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [BuyerUsersController],
  providers: [BuyerUsersService],
})
export class BuyerUsersModule {}

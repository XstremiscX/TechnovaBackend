import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [SalesController],
  imports: [DatabaseModule, JwtModule],
  providers: [SalesService],
})
export class SalesModule {}

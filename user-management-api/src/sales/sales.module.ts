import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [SalesController],
  imports: [DatabaseModule],
  providers: [SalesService],
})
export class SalesModule {}

import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [BrandsController],
  imports: [DatabaseModule],
  providers: [BrandsService],
})
export class BrandsModule {}

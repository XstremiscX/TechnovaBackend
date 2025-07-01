import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProductsController],
  imports:[DatabaseModule,JwtModule],
  providers: [ProductsService],
})
export class ProductsModule {}

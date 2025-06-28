import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [CategoriesController],
  imports:[DatabaseModule],
  providers: [CategoriesService],
})
export class CategoriesModule {}

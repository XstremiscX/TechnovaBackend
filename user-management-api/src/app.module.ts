import { Module } from "@nestjs/common";
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { SellerUsersModule } from './seller_users/seller_users.module';

@Module({
    imports : [DatabaseModule, CategoriesModule, SellerUsersModule],
    providers: [DatabaseService]
})
export class AppModule{}
import { Module } from "@nestjs/common";
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { SellerUsersModule } from './seller_users/seller_users.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';

@Module({
    imports : [DatabaseModule, CategoriesModule, SellerUsersModule, BrandsModule, ProductsModule],
    providers: [DatabaseService]
})
export class AppModule{}
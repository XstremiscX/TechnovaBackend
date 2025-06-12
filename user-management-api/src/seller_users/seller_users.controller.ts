import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellerUsersService } from './seller_users.service';
import { CreateSellerUserDto } from './dto/create-seller_user.dto';
import { UpdateSellerUserDto } from './dto/update-seller_user.dto';

@Controller('seller-users')
export class SellerUsersController {
  constructor(private readonly sellerUsersService: SellerUsersService) {}

  @Post()
  create(@Body() createSellerUserDto: CreateSellerUserDto) {
    try{
      this.sellerUsersService.create(createSellerUserDto);
    }catch (error) {
      throw new Error(`Error creating seller user: ${error.message}`);
    }
  }

  @Get(':id')
  findInfo(@Param('id') id: string) {
    try{
      return this.sellerUsersService.findInfo(id);
    }catch (error) {
      throw new Error(`Error finding seller user with id ${id}: ${error.message}`);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerUserDto: UpdateSellerUserDto) {
    return this.sellerUsersService.update(id, updateSellerUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.sellerUsersService.remove(id);
  }
}

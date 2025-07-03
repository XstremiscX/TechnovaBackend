import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuyerUsersService } from './buyer_users.service';
import { CreateBuyerUserDto } from './dto/create-buyer_user.dto';
import { UpdateBuyerUserDto } from './dto/update-buyer_user.dto';

@Controller('buyer-users')
export class BuyerUsersController {
  constructor(private readonly buyerUsersService: BuyerUsersService) {}

  @Post()
  create(@Body() createBuyerUserDto: CreateBuyerUserDto) {
    return this.buyerUsersService.create(createBuyerUserDto);
  }

  @Get()
  findAll() {
    return this.buyerUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyerUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyerUserDto: UpdateBuyerUserDto) {
    return this.buyerUsersService.update(+id, updateBuyerUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyerUsersService.remove(+id);
  }
}

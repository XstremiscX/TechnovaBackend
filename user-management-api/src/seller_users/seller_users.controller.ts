import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SellerUsersService } from './seller_users.service';
import { CreateSellerUserDto } from './dto/create-seller_user.dto';
import { UpdateSellerUserDto } from './dto/update-seller_user.dto';
import { XssAtackPreventionPipe } from 'src/globalpipes/xss-atack-prevention/xss-atack-prevention.pipe';
import { LogInSellerDto } from './dto/logIn-seller.dto';
import { SellerUsersGuard } from './seller_users.guard';

@Controller('seller-users')
export class SellerUsersController {
  constructor(private readonly sellerUsersService: SellerUsersService) {}

  @Post()
  async create(@Body(XssAtackPreventionPipe) createSellerUserDto: CreateSellerUserDto) {
    
    return await this.sellerUsersService.create(createSellerUserDto);

  }

  @Post('change-password/:id')
  @UseGuards(SellerUsersGuard)
  changePassword(@Param('id') id:string, @Body(XssAtackPreventionPipe) newPassword: JSON) {
    try{
      return this.sellerUsersService.changePassword(id, newPassword);
    }catch (error) {
      throw new Error(`Error changing password for seller user with id ${id}: ${error.message}`);
    }
  }

  @Get('/verify/:id')
  verifyUser(@Param('id') id:string){
    try{
      return this.sellerUsersService.verifyUser(id);
    }catch (error) {
      throw new Error(`Error verifying seller user with id ${id}: ${error.message}`);
    }
  }

  @Get(':id')
  @UseGuards(SellerUsersGuard)
  findInfo(@Param('id') id: string) {
    try{
      return this.sellerUsersService.findInfo(id);
    }catch (error) {
      throw new Error(`Error finding seller user with id ${id}: ${error.message}`);
    }
  }

  @Patch(':id')
  @UseGuards(SellerUsersGuard)
  update(@Param('id') id: string, @Body(XssAtackPreventionPipe) updateSellerUserDto: UpdateSellerUserDto) {
    return this.sellerUsersService.update(id, updateSellerUserDto);
  }

  @Delete(':id')
  @UseGuards(SellerUsersGuard)
  remove(@Param('id') id: string) {
    return this.sellerUsersService.remove(id);
  }

  @Post('login')
  async logIn(@Body(XssAtackPreventionPipe) loginData: LogInSellerDto) {
    return await this.sellerUsersService.login(loginData);
  }
}

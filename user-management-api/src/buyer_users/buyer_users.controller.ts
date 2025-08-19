import { Controller, Get, Post, Body, Req, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { BuyerUsersService } from './buyer_users.service';
import { CreateBuyerUserDto } from './dto/create-buyer_user.dto';
import { XssAtackPreventionPipe } from 'src/globalpipes/xss-atack-prevention/xss-atack-prevention.pipe';
import { LoginDataDto } from './dto/login-data.dto';
import { TokenVerificationGuard } from 'src/globalguards/token_verification.guard';
import { UpdateBuyerUserDto } from './dto/update-buyer_user.dto';
import { CreatAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('buyer-users')
export class BuyerUsersController {
  constructor(private readonly buyerUsersService: BuyerUsersService) {}

  @Post()
  create(@Body(XssAtackPreventionPipe) createBuyerUserDto: CreateBuyerUserDto) {
    
    return this.buyerUsersService.create(createBuyerUserDto);

  }

  @Post('login')
  login(@Body(XssAtackPreventionPipe) loginData:LoginDataDto){

    return this.buyerUsersService.login(loginData);

  }

  @Post('info')
  @UseGuards(TokenVerificationGuard)
  getUserData(@Req() req: Request) {

    const token = req.headers['authorization'];

    return this.buyerUsersService.getUserData(token);

  }

  @Post('change-password')
  @UseGuards(TokenVerificationGuard)
  changePassword(@Req() req: Request, @Body(XssAtackPreventionPipe) newPassword: JSON) {

    const token = req.headers['authorization'];

    return this.buyerUsersService.changePassword(token, newPassword);

  }


  @Patch()
  @UseGuards(TokenVerificationGuard)
  updateUser(@Req() req: Request,@Body(XssAtackPreventionPipe) updateBuyerUserDto: UpdateBuyerUserDto) {

    const token = req.headers['authorization'];

    return this.buyerUsersService.updateUser(token, updateBuyerUserDto);

  }

  @Get('verify/:id')
  verifyUser(@Param('id') id: string) {

    return this.buyerUsersService.verifyUser(id);

  }

  @Delete()
  @UseGuards(TokenVerificationGuard)
  deleteAccount(@Req() req:Request){

    const token = req.headers['authorization'];

    return this.buyerUsersService.deleteAccount(token);

  }

  // Sección de las direcciones.
  @Post('address')
  @UseGuards(TokenVerificationGuard)
  createAddress(@Req() req:Request,@Body(XssAtackPreventionPipe) createAddressDto:CreatAddressDto){

    const token = req.headers['authorization'];

    return this.buyerUsersService.createAddress(token,createAddressDto);

  }

  @Post('address/update')
  @UseGuards(TokenVerificationGuard)
  updateAddress(@Body(XssAtackPreventionPipe) updateAddressDto:UpdateAddressDto){

    return this.buyerUsersService.updateAddress(updateAddressDto);

  }

  @Get('address')
  @UseGuards(TokenVerificationGuard)
  findAddress(@Req() req:Request){

    const token = req.headers['authorization'];

    return this.buyerUsersService.findAddress(token);

  }

  @Delete('address/:id')
  @UseGuards(TokenVerificationGuard)
  deleteAddress(@Param('id') id:string){

    return this.buyerUsersService.deleteAddress(id);

  }

  //Sección de las tarjetas.
  @Post('cards')
  @UseGuards(TokenVerificationGuard)
  addCart(@Req() req: Request,@Body(XssAtackPreventionPipe) createCardDto:CreateCardDto){

    const token = req.headers['authorization'];

    return this.buyerUsersService.addCard(token,createCardDto);

  }

  @Get('cards')
  @UseGuards(TokenVerificationGuard)
  findCards(@Req() req:Request){

    const token  = req.headers['authorization'];

    return this.buyerUsersService.findCards(token);

  }

  @Post('cards/update')
  @UseGuards(TokenVerificationGuard)
  updateCard(@Body() updateCardDto: UpdateCardDto){

    return this.buyerUsersService.updateCard(updateCardDto);

  }

  @Delete('cards/:id')
  @UseGuards(TokenVerificationGuard)
  deleteCard(@Param('id') id: string){

    return this.buyerUsersService.deleteCard(id);

  }

}

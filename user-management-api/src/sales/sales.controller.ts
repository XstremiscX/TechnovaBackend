import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSalesDetailDto } from './dto/create-sales_detail.dto';
import { XssAtackPreventionPipe } from 'src/globalpipes/xss-atack-prevention/xss-atack-prevention.pipe';
import { TokenVerificationGuard } from 'src/globalguards/token_verification.guard';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseGuards(TokenVerificationGuard)
  createSale(@Body(XssAtackPreventionPipe) createSaleDto: CreateSaleDto){

    return this.salesService.createSale(createSaleDto);

  }

  @Post('/sales-detail/:sale_id')
  @UseGuards(TokenVerificationGuard)
  createSaleDetail(@Body(XssAtackPreventionPipe) arrayCreateSaleDetailDto: CreateSalesDetailDto[], @Param('sale_id') sale_id:string){

    return this.salesService.createSaleDetail(arrayCreateSaleDetailDto, sale_id);

  }

  @Get()
  @UseGuards(TokenVerificationGuard)
  async findAllSales(@Req() req: Request){

    const token = req.headers['authorization'];

    return await this.salesService.findAllSales(token);

  }

  @Get('sales-detail/:sale_id')
  @UseGuards(TokenVerificationGuard)
  async findSaleDetails(@Param('sale_id') sale_id:string){

    return await this.salesService.findSaleDetails(sale_id);

  }

}

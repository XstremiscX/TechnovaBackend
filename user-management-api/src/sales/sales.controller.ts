import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSalesDetailDto } from './dto/create-sales_detail.dto';
import { XssAtackPreventionPipe } from 'src/globalpipes/xss-atack-prevention/xss-atack-prevention.pipe';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  createSale(@Body(XssAtackPreventionPipe) createSaleDto: CreateSaleDto){

    return this.salesService.createSale(createSaleDto);

  }

  @Post('/sales-detail/:sale_id')
  createSaleDetail(@Body(XssAtackPreventionPipe) arrayCreateSaleDetailDto: CreateSalesDetailDto[], @Param('sale_id') sale_id:string){

    return this.salesService.createSaleDetail(arrayCreateSaleDetailDto, sale_id);

  }

}

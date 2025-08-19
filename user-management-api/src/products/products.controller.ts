import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ExecutionContext, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { XssAtackPreventionPipe } from 'src/globalpipes/xss-atack-prevention/xss-atack-prevention.pipe';
import { TokenVerificationGuard } from 'src/globalguards/token_verification.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(TokenVerificationGuard)
  create( @Req() req:Request, @Body(XssAtackPreventionPipe) createProductDto: CreateProductDto) {
    const token = req.headers['authorization'];
    return this.productsService.create(createProductDto, token);
  }

  @Post('/my-products')
  @UseGuards(TokenVerificationGuard)
  listSellerProducts(@Req() req:Request){

    const token = req.headers['authorization'];

    return this.productsService.listSellerProducts(token);

  }

  @Post('/update-product')
  @UseGuards(TokenVerificationGuard)
  updateProduct(@Body(XssAtackPreventionPipe) updateProductDto:UpdateProductDto){

    return this.productsService.updateProduct(updateProductDto);

  }

  @Get()
  listAll() {
    return this.productsService.listAll();
  }

  @Get(":id")
  getProductDetail(@Param("id") id: string){

    return this.productsService.getProductDetail(id);

  }


}

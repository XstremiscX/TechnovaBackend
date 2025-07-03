import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { TokenVerificationGuard } from 'src/globalguards/token_verification.guard';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    listSellerProducts: jest.fn(),
    updateProduct: jest.fn(),
    listAll: jest.fn(),
  };

  const mockGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
      ],
    })
      .overrideGuard(TokenVerificationGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call productsService.create with correct params', async () => {
      const dto: CreateProductDto = { name: 'Test', price: 10 } as any;
      const req: any = { headers: { authorization: 'Bearer token' } };
      mockProductsService.create.mockResolvedValue('created');

      const result = await controller.create(req, dto);

      expect(service.create).toHaveBeenCalledWith(dto, 'Bearer token');
      expect(result).toBe('created');
    });
  });

  describe('listSellerProducts', () => {
    it('should call productsService.listSellerProducts with token', async () => {
      const req: any = { headers: { authorization: 'Bearer token' } };
      mockProductsService.listSellerProducts.mockResolvedValue(['product1']);

      const result = await controller.listSellerProducts(req);

      expect(service.listSellerProducts).toHaveBeenCalledWith('Bearer token');
      expect(result).toEqual(['product1']);
    });
  });

  describe('updateProduct', () => {
    it('should call productsService.updateProduct with dto', async () => {
      const dto: UpdateProductDto = { id: 1, name: 'Updated' } as any;
      mockProductsService.updateProduct.mockResolvedValue('updated');

      const result = await controller.updateProduct(dto);

      expect(service.updateProduct).toHaveBeenCalledWith(dto);
      expect(result).toBe('updated');
    });
  });

  describe('listAll', () => {
    it('should call productsService.listAll', async () => {
      mockProductsService.listAll.mockResolvedValue(['product1', 'product2']);

      const result = await controller.listAll();

      expect(service.listAll).toHaveBeenCalled();
      expect(result).toEqual(['product1', 'product2']);
    });
  });
});

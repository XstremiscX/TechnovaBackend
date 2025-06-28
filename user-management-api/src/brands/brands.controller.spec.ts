import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

describe('BrandsController', () => {
  let controller: BrandsController;
  let service: BrandsService;
  const mockService = {
    findAll: jest.fn().mockResolvedValue([
      {
        brand_id:"id1",
        brand_name:"brand_name1"
      },
      {
        brand_id:"id2",
        brand_name:"brand_name2"
      }
    ])
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        {
          provide:BrandsService,
          useValue: mockService
        }
      ],
    }).compile();

    controller = module.get<BrandsController>(BrandsController);
    service = module.get<BrandsService>(BrandsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("Debería llamar a correctamente al metodo del servicio findAll",()=>{

    //Llamamos al metodo del controllador findAll.
    controller.findAll();

    //Verificamos que si este llamando correctamente al metodo del servicio.
    expect(mockService.findAll).toHaveBeenCalled();
  })
});

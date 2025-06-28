import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;
  let mockService = {
    findAll : jest.fn().mockResolvedValue( 
      [
        {
          category_id:"id1",
          category_name:"name1",
          category_description:"description1"
        },
        {
          category_id:"id2",
          category_name:"name2",
          category_description:"description2"
        },
        {
          category_id:"id3",
          category_name:"name3",
          category_description:"description3"
        }
      ]
    )
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockService
        }
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("Debería llamar al metodo findAll()",()=>{
    
    //Ejecutamos la llamada al controlador
    controller.findAll();

    //Verificamos que si haya llamado al metodo findAll del servicio.
    expect(mockService.findAll).toHaveBeenCalled();
  })

});

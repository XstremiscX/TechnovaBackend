import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { DatabaseService } from 'src/database/database.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockDb = {
    justQuery : jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService,
        {
          provide:DatabaseService,
          useValue: mockDb  
        }
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe("findAll()",()=>{
    
    it("Debería devovler satisfactoriamente todas las categorias y sus datos", async ()=>{

      //Simulamos la ejecución de la llamada a la abse de datos que devuelve exitosamente los datos.
      mockDb.justQuery.mockResolvedValue([
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
      ])

      //Testeamos el metodo y almacenamos el resultado.
      const res = await service.findAll();

      //Testeamos que la respuesta si este definida.
      expect(res).toBeDefined();

      //Revisamos que si se halla llamado correctamente a la abse de datos con el query correcto.
      expect(mockDb.justQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM categories")
      )

    })

    it("Debería mandar un error de tipo httpcexeption al no encontrar ninguna categoría",async ()=>{

      //Simulamos que al llamar a la base de datos esta no encontro ninguna categoria.
      mockDb.justQuery.mockResolvedValue([]);

      //Testeamos el metodo esperando que arroje un error.
      await expect(service.findAll()).rejects.toThrow(expect.objectContaining({
        message : "Categories not found",
        status: 404
      }))

    })

    it("Debería mandar un error en caso de que ocurra algun problema durante la execución del código", async () =>{

      //Generamos un mensaje de error de prueba.
      const errorMessage = "Error al conectar a la base de datos.";

      //Simulamos que la llamada a la base de datos arroja un error.
      mockDb.justQuery.mockImplementation(()=>{
        throw new Error(errorMessage);
      })

      //Testeamos el metodo esperando que arroje un error.
      await expect(service.findAll()).rejects.toThrow(errorMessage);
    })

  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

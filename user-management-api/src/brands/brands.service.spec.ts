import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { DatabaseService } from 'src/database/database.service';

describe('BrandsService', () => {
  let service: BrandsService;
  let mockDb = {
    justQuery: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandsService,
        {
          provide: DatabaseService,
          useValue: mockDb
        }
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("findAll()",()=>{

    it("Debería ejecutarse stisfactoriamente y devolver un arreglo con los datos de las marcas",async ()=>{

      //Simulamos el llamado a la base de datos y devolvemos los datos esperados.
      mockDb.justQuery.mockResolvedValue([
        {
          brand_id: "brand1",
          brand_name: "brand1"
        },
        {
          brand_id: "brand2",
          brand_name: "brand2"
        }
      ])

      //Testeamos el metodo y almacenamos el resultado en una variable.
      const res = await service.findAll();

      //Evaluamos que el resultado este definido.
      expect(res).toBeDefined();

      //Testeamos que la llamada a la base de datos sea con el query correcto.
      expect(mockDb.justQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM brands")
      )

    })

    it("Debería mandar un error de tipo httpcexeption al no encontrar ninguna marca",async ()=>{

      //Simulamos que al llamar a la base de datos esta no encontro ninguna categoria.
      mockDb.justQuery.mockResolvedValue([]);

      //Testeamos el metodo esperando que arroje un error.
      await expect(service.findAll()).rejects.toThrow(expect.objectContaining({
        message : "Brands not found",
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
});

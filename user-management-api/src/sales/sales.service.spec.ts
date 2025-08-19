import { Test, TestingModule } from '@nestjs/testing';
import { SalesService } from './sales.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';

describe('SalesService', () => {
  let service: SalesService;
  let mockDb = {
    query: jest.fn(),
  }
  let mockJWT = {
    singAsync: jest.fn(),
    verifyAsync: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesService, 
        { provide: DatabaseService, 
          useValue: mockDb 
        },
        {
          provide: JwtService,
          useValue: mockJWT
        }
      ],
    }).compile();

    service = module.get<SalesService>(SalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("createSale()",()=>{

    //Creamos un createSaleDto de prueba.
    const createSaleDto = {
      buyer_id: 'test-buyer-id',
      amount: 100.00
    }

    it("Debería crear un venta correctamente y retornar el id de la venta", async () => {

      //Simulamos la llamada a la base de datos.
      mockDb.query.mockResolvedValue([]);
      
      //testeamos el método createSale y almacenamos el resultado.
      const result = await service.createSale(createSaleDto);

      //Verificamos que el resultado sea un string (id de la venta).
      expect(typeof result).toBe('string');

      //Testeamos que se haya llamado al método query de la base de datos con los parámetros correctos.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO sales (sale_id, buyer_id, amount, sale_date) VALUES"),
        expect.any(Array)
      );

    })

    it("Debería lanzar un error si ocurre un problema al crear la venta", () => {

        //Simulamos un error en la base de datos.
        mockDb.query.mockImplementation(()=>{
          throw new Error("Database error");
        })

        //Testeamos que se lance un error al llamar a createSale.
        expect(()=>{service.createSale(createSaleDto)}).toThrow("Error creating sale: Database error");

      }
    )
  })

  describe("createSaleDetail()",()=>{

    //Creamos un createSaleDto de prueba.
    const createSaleDetailDto = {
      product_id: 'test-product-id',
      unite_price: 50.00,
      quantity: 2
    }

    //Creamos un sale_id de prueba.
    const sale_id = 'test-sale-id';

    it("Debería crear un detalle de venta correctamente y retornar un mensaje de exito", async () => {

      //Simulamos la llamada a la base de datos.
      mockDb.query.mockResolvedValue([]);
      
      //testeamos el método createSale y almacenamos el resultado.
      const result = await service.createSaleDetail([createSaleDetailDto], sale_id);

      //Verificamos que el resultado sea un string (mensaje de éxito).
      expect(result).toBe('Sale created successfully');

      //Testeamos que se haya llamado al método query de la base de datos con los parámetros correctos.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO sale_details (detail_id, sale_id, product_id, unite_price, quantity) VALUES"),
        expect.any(Array)
      )

    })

    it("Debería lanzar un error si ocurre un problema al crear la venta", () => {

        //Simulamos un error en la base de datos.
        mockDb.query.mockImplementation(()=>{
          throw new Error("Database error");
        })

        //Testeamos que se lance un error al llamar a createSale.
        expect(()=>{service.createSaleDetail([createSaleDetailDto],sale_id)}).toThrow("Error creating sale detail: Database error");

      }
    )
  })

  describe("findAllSales()", ()=>{

    //Creamos un token de prueba.
    const token = 'test-token';

    beforeEach(() => {
      jest.clearAllMocks();
      mockDb.query.mockReset(); // opcional para resetear implementación
    });


    it("Debería retornar todas las compras del usuario", async ()=>{

      //Simulamos la solución del método verifyAsync del JWTService.
      mockJWT.verifyAsync.mockResolvedValue({ user_id: 'test-user-id' });

      //Simulamos la llamada a la base de datos.
      mockDb.query.mockResolvedValue([]);

      //Testeamos el método findAllSales y almacenamos el resultado.
      const result = await service.findAllSales(token);

      //Verificamos que el resultado sea un array.
      expect(Array.isArray(result)).toBe(true);

      //Testeamos que se haya llamado al método query de la base de datos con los parámetros correctos.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM sales"),
        expect.any(Array)
      );
    });

    it("Debería lanzar un error si ocurre un problema al extraer la información", async () => {

        //Simulamos la solución del método verifyAsync del JWTService.
        mockJWT.verifyAsync.mockResolvedValue({user_id:"id"});

        //Simulamos un error en la base de datos.
        mockDb.query.mockImplementation(()=>{
          throw new Error("Database error");
        })

        //Testeamos que se lance un error al llamar a createSale.
       await expect(service.findAllSales(token)).rejects.toThrow("Error fetching sales: Database error");

      }
    )

  })

  describe("findSaleDetails()", ()=>{
    
    //Creamos un sale_id de prueba.
    const sale_id = 'test-sale-id';

    it("Debería retornar los detalles de una venta", async ()=>{

      //simulamos la llamada a la base de datos.
      mockDb.query.mockResolvedValue([]);

      //Testeamos el método findSaleDetails y almacenamos el resultado.
      const result = await service.findSaleDetails(sale_id);

      //Verificamos que el resultado sea un array.
      expect(Array.isArray(result)).toBe(true);

      //Testeamos que se haya llamado al método query de la base de datos con los parámetros correctos.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT s.sale_id, s.amount,s.sale_date, sd.detail_id"),
        expect.any(Array)
      )

    })

    it("Debería lanzar un error si ocurre un problema al extraer la información", async () => {

      //Simulamos un error en la base de datos.
      mockDb.query.mockImplementation(()=>{
        throw new Error("Database error");
      })

      //Testeamos que se lance un error al llamar a findSaleDetails.
      await expect(service.findSaleDetails(sale_id)).rejects.toThrow("Error fetching sale details: Database error");

    })

  })
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { mock } from 'node:test';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockJwt = {
    verifyAsync: jest.fn()
  }
  let mockDb = {
    query: jest.fn(),
    justQuery: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService,
        {
          provide: JwtService,
          useValue: mockJwt
        },
        {
          provide: DatabaseService,
          useValue:mockDb
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create()",()=>{

    //Creamos un createProductsDto para las pruebas.
    const createProductDto = {
      "brand_id":"4119bd51-226d-4e3d-8775-26f6665f1424",
      "category_id":"4880d444-b81c-41c7-8a6e-5381037883e5",
      "product_name":"product 1",
      "price": 31.2,
      "quantity": 12,
      "description": "description 1",
      "product_image":"C:/productImage.png",
      "product_status":"true"
    }

    //Creo un token falso para los test.
    const token = "token falso";

    it("Debería crear el producto satisfactoriamente y devolver un objeto con un mensaje y un objeto de de producto adentro.", async ()=>{

      //Mockeo el resultado de la verificación del token.
      mockJwt.verifyAsync.mockResolvedValue({seller_id:"b663f33c-ae76-49bd-a185-752c49f867dc"});

      //Simulamos la llamada de la base de datos.
      mockDb.query.mockResolvedValue([
        {
          "product_id":"85e56541-0323-4761-a495-0b8fbd8059d9",
          "brand_id":"4119bd51-226d-4e3d-8775-26f6665f1424",
          "category_id":"4880d444-b81c-41c7-8a6e-5381037883e5",
          "seller_id":"b663f33c-ae76-49bd-a185-752c49f867dc",
          "product_name":"product 1",
          "price": 31.2,
          "quantity": 12,
          "description": "description 1",
          "product_image":"C:/productImage.png",
          "product_status":true
        }
      ])

      //Ejecuto el metodo y almaceno el resultado en una variable.
      const res = await service.create(createProductDto,token);

      //Testeamos que el valor de res este definido.
      expect(res).toBeDefined();

      //Testeamos que el resultado sea el esperado.
      expect(res).toEqual(
        {
          message:"Product creation successfully.",
          product_object: {
            "product_id":"85e56541-0323-4761-a495-0b8fbd8059d9",
            "brand_id":"4119bd51-226d-4e3d-8775-26f6665f1424",
            "category_id":"4880d444-b81c-41c7-8a6e-5381037883e5",
            "seller_id":"b663f33c-ae76-49bd-a185-752c49f867dc",
            "product_name":"product 1",
            "price": 31.2,
            "quantity": 12,
            "description": "description 1",
            "product_image":"C:/productImage.png",
            "product_status":true
          }
        }
      );

      //Testeamos que la llamada a la base de datos se haya hecho con el query correct y parametros.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO products(product_id,brand_id,category_id,seller_id,product_name,price,quantity,description,product_image,product_status) VALUES "),
        expect.any(Array)
      )

    })

    it("Debería arrojar un error si la base de datos no retorna ningun resultado.",async ()=>{

      //mockeamos el resultado de el token.
      mockJwt.verifyAsync.mockResolvedValue({seller_id:"id"});

      //mockeamos el resultado de la llamada a la base de datos.
      mockDb.query.mockResolvedValue([]);

      //Esperamos que arroje un error.
      await expect(service.create(createProductDto,token)).rejects.toThrow(expect.objectContaining({
        message:"An error has occurred during the product creation.",
        status: 500
      }))

    })

    it("Debería arrojar un error si ocurre algún problema durante la ejecución del código.",async ()=>{

      //mockeamos el resultado de el token.
      mockJwt.verifyAsync.mockImplementation(()=>{
        throw new Error("An error has ocurred.")
      });

      //mockeamos el resultado de la llamada a la base de datos.
      mockDb.query.mockResolvedValue([]);

      //Esperamos que arroje un error.
      await expect(service.create).rejects.toThrow()

    })

  })

  describe("listAll()",()=>{

    it("Debería devovler un arreglo de objetos, con los datos de todos los productos de la base de datos",async ()=>{

      //Simulamos la llamada a la base de datos.
      mockDb.justQuery.mockResolvedValue([
        {
          "product_id": "85e56541-0323-4761-a495-0b8fbd8059d9",
          "seller_id": "b663f33c-ae76-49bd-a185-752c49f867dc",
          "category_id": "4880d444-b81c-41c7-8a6e-5381037883e5",
          "brand_id": "4119bd51-226d-4e3d-8775-26f6665f1424",
          "product_name": "product 1",
          "price": "31.2",
          "quantity": 12,
          "description": "description 1",
          "product_image": "C:/productImage.png",
          "product_status": false
        },
        {
          "product_id": "c6a949f1-d93b-47b8-8723-d45ef04c1e8e",
          "seller_id": "b663f33c-ae76-49bd-a185-752c49f867dc",
          "category_id": "4880d444-b81c-41c7-8a6e-5381037883e5",
          "brand_id": "4119bd51-226d-4e3d-8775-26f6665f1424",
          "product_name": "product 1",
          "price": "31.2",
          "quantity": 12,
          "description": "description 1",
          "product_image": "C:/productImage.png",
          "product_status": false
        }
      ])

      //Testeamos el metodo.
      const res = await service.listAll();

      //Testeamos que el resultado si este definido.
      expect(res).toBeDefined()

      //Testeamos que sea igaul al esperado.
      expect(res).toEqual([
        {
          "product_id": "85e56541-0323-4761-a495-0b8fbd8059d9",
          "seller_id": "b663f33c-ae76-49bd-a185-752c49f867dc",
          "category_id": "4880d444-b81c-41c7-8a6e-5381037883e5",
          "brand_id": "4119bd51-226d-4e3d-8775-26f6665f1424",
          "product_name": "product 1",
          "price": "31.2",
          "quantity": 12,
          "description": "description 1",
          "product_image": "C:/productImage.png",
          "product_status": false
        },
        {
          "product_id": "c6a949f1-d93b-47b8-8723-d45ef04c1e8e",
          "seller_id": "b663f33c-ae76-49bd-a185-752c49f867dc",
          "category_id": "4880d444-b81c-41c7-8a6e-5381037883e5",
          "brand_id": "4119bd51-226d-4e3d-8775-26f6665f1424",
          "product_name": "product 1",
          "price": "31.2",
          "quantity": 12,
          "description": "description 1",
          "product_image": "C:/productImage.png",
          "product_status": false
        }
      ])

      //Testeamos que se haya llamado correctamente a la base de datos con el query correcto.
      expect(mockDb.justQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM products")
      )
    })

    it("Debería lanzar un error si no encuentra ningun producto.",async ()=>{

      //simulamos que la base de datos no encuentra ningun resultado.
      mockDb.justQuery.mockResolvedValue([]);

      //Testeamos que lance un error de NOT_FOUND.
      await expect(service.listAll()).rejects.toThrow(expect.objectContaining({
        message:"Products not found",
        status:404
      }))

    })

    it("Debería lanzar un error si ocurre algun problema durante la ejecución del código.",async ()=>{

      //simulamos que la base de datos no encuentra ningun resultado.
      mockDb.justQuery.mockImplementation(()=>{
        throw new Error("An error has ocurred")
      });

      //Testeamos que lance un error de NOT_FOUND.
      await expect(service.listAll()).rejects.toThrow("An error has ocurred");

    })

  })

  describe("listSellerProducts()",()=>{

    //Creamos un token de prueba.
    const token = "token";

    it("Debería devolver una lista de objetos con todos los productos del vendedor.",async ()=>{

      //mockeamos el resultado de la verificación del token.
      mockJwt.verifyAsync.mockResolvedValue({seller_id:"id"});

      //mockeamos el resultado de la llamada a la base de datos.
      mockDb.query.mockResolvedValue([
        {
          "product_id": "85e56541-0323-4761-a495-0b8fbd8059d9",
          "seller_id": "b663f33c-ae76-49bd-a185-752c49f867dc",
          "category_id": "4880d444-b81c-41c7-8a6e-5381037883e5",
          "brand_id": "4119bd51-226d-4e3d-8775-26f6665f1424",
          "product_name": "product 1",
          "price": "31.2",
          "quantity": 12,
          "description": "description 1",
          "product_image": "C:/productImage.png",
          "product_status": false
        },
        {
          "product_id": "c6a949f1-d93b-47b8-8723-d45ef04c1e8e",
          "seller_id": "b663f33c-ae76-49bd-a185-752c49f867dc",
          "category_id": "4880d444-b81c-41c7-8a6e-5381037883e5",
          "brand_id": "4119bd51-226d-4e3d-8775-26f6665f1424",
          "product_name": "product 1",
          "price": "31.2",
          "quantity": 12,
          "description": "description 1",
          "product_image": "C:/productImage.png",
          "product_status": false
        }
      ])

      //Testeamos el metodo y almacenamos el resultado.
      const res = await service.listSellerProducts(token);

      //Testeamos que el resultado si este definido.
      expect(res).toBeDefined();

      //Testeamos que se el resultado esperado.
      expect(res).toEqual([
        {
          "product_id": "85e56541-0323-4761-a495-0b8fbd8059d9",
          "seller_id": "b663f33c-ae76-49bd-a185-752c49f867dc",
          "category_id": "4880d444-b81c-41c7-8a6e-5381037883e5",
          "brand_id": "4119bd51-226d-4e3d-8775-26f6665f1424",
          "product_name": "product 1",
          "price": "31.2",
          "quantity": 12,
          "description": "description 1",
          "product_image": "C:/productImage.png",
          "product_status": false
        },
        {
          "product_id": "c6a949f1-d93b-47b8-8723-d45ef04c1e8e",
          "seller_id": "b663f33c-ae76-49bd-a185-752c49f867dc",
          "category_id": "4880d444-b81c-41c7-8a6e-5381037883e5",
          "brand_id": "4119bd51-226d-4e3d-8775-26f6665f1424",
          "product_name": "product 1",
          "price": "31.2",
          "quantity": 12,
          "description": "description 1",
          "product_image": "C:/productImage.png",
          "product_status": false
        }
      ])

      //Testeamos que la llamada a la base de datos haya sido con el query correcto y los parametros.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining(""),
        expect.any(Array)
      )

    })

    it("Debería retornar el mensaje: No products avaibles.",async ()=>{

      //mockeamos el resultado del token.
      mockJwt.verifyAsync.mockResolvedValue({seller_id:"id"})

      //simulamos que la base de datos no encuentra ningun resultado.
      mockDb.query.mockResolvedValue([]);

      //Testeamos el metodo y guardamos el resultado.
      const res = await service.listSellerProducts(token);

      //Testeamos que el resultado este definido.
      expect(res).toBeDefined();

      //Testeamos que haya devuelto el valor esperado.
      expect(res).toBe("No products avaibles.");

    })

    it("Debería lanzar un error si ocurre algun problema durante la ejecución del código.",async ()=>{

      //simulamos que la base de datos no encuentra ningun resultado.
      mockDb.query.mockImplementation(()=>{
        throw new Error("An error has ocurred")
      });

      //Testeamos que lance un error de NOT_FOUND.
      await expect(service.listSellerProducts(token)).rejects.toThrow("An error has ocurred");

    })

    it("Debería lanzar un error en caso de que el resultado de la base de datos sea undefined.",async ()=>{

      //Mockeamos el resultado del token.
      mockJwt.verifyAsync.mockResolvedValue({seller_id:"id"});

      //Mockeamos el resultado de la base de datos para que devuelva undefined.
      mockDb.query.mockImplementation(undefined);
      
      //Testeamos que el metodo arroje un error.
      await expect(service.listSellerProducts(token)).rejects.toThrow(expect.objectContaining({
        message: "An error has occurred during the data extraction.",
        status: 500
      }))

    })

  })
});

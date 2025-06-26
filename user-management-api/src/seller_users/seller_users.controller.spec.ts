import { Test, TestingModule } from '@nestjs/testing';
import { SellerUsersController } from './seller_users.controller';
import { SellerUsersService } from './seller_users.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { SellerUsersGuard } from './seller_users.guard';

describe('SellerUsersController', () => {
  let controller: SellerUsersController;
  let service: SellerUsersService;

  const mockService = {
    create: jest.fn(),
    changePassword: jest.fn(),
    verifyUser: jest.fn(),
    findInfo: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    login: jest.fn()
  }

  const mockJwt = {
    signAsync: jest.fn().mockResolvedValue("fake-token"),
    verify: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerUsersController],
      providers: [
        {
          provide: SellerUsersService,
          useValue: mockService
        },
        {
          provide: JwtService,
          useValue: mockJwt
        }
      ]
    }).compile();

    controller = module.get<SellerUsersController>(SellerUsersController);
    service = module.get<SellerUsersService>(SellerUsersService);
  });

  describe("create()",()=>{

    //Creamos un objeto de tipo createSellerUserDto para las pruebas.
    const createSellerUserDto = {
      seller_name:"Prueba 1",
      address:"Colombia,Antioquia,Medellín,Manrique Central 2, Carrera 44,69,56,Piso 201",
      user_password:"Prueba 1",
      email:"josecarva16@gmail.com",
      cellphone_number:"3160456789",
      user_type:0
    }

    it("Debería llamar al metodo con los datos del dto y retornar un mensaje de exito", async ()=>{
      
      //Mensaje esperado
      const expectedResult = "User created successfully";
      
      //Simulamos que el servicio se ejecuto correctamente.
      mockService.create.mockResolvedValue(expectedResult);

      //Testeamos el metodo y guardamos el resultado de la ejecucuión.
      const res = await mockService.create(createSellerUserDto);

      //Testeamos que si se haya llamado al metodo con los datos del dto.
      expect(mockService.create).toHaveBeenCalledWith(createSellerUserDto);

      //Testeamos que el mensaje devuelto si sea el esperado.
      expect(res).toBe(expectedResult);
    })
  })

  describe("changePassword()",()=>{

    //Creamos un id para las pruebas.
    const id = "userId";

    //creamos una nueva contraseña para las pruebas
    const newPassword = JSON.parse('{"new_password":"newPassword"}');

    it("Debería llamar al metodo con los datos del id y el json que contiene la nueva contraseña y retornar un mensaje de exito", async ()=>{
      
      //Mensaje esperado
      const expectedResult = "User password changed successfully";
      
      //Simulamos que el servicio se ejecuto correctamente.
      mockService.changePassword.mockResolvedValue(expectedResult);

      //Testeamos el metodo y guardamos el resultado de la ejecucuión.
      const res = await mockService.changePassword(id,newPassword);

      //Testeamos que si se haya llamado al metodo con los datos del id y la nueva contraseña.
      expect(mockService.changePassword).toHaveBeenCalledWith(id,newPassword);

      //Testeamos que el mensaje devuelto si sea el esperado.
      expect(res).toBe(expectedResult);
    })

    it("Debería tener el decorador UseGuards con el guard: SellerUsersGuard",()=>{
      
      //Creamos una instancia de la calse Reflector
      const reflector = new Reflector();

      //Obtenemos los guards que se estan usando en el metodo.
      const guards = Reflect.getMetadata('__guards__',controller.changePassword);

      //Verificamos si el guard SellerUsersGuard esta entre los utilizados.
      const usesSellerUsersGuard = guards?.some((e) => e.name === SellerUsersGuard.name);

      //Testeamos si se usa el guard.
      expect(usesSellerUsersGuard).toBe(true);

    })
  })

  describe("verifyUser()",()=>{

    //Creamos un id para las pruebas.
    const id = "userId";

    it("Debería llamar al metodo con los datos del id y retornar un mensaje de exito", async ()=>{
      
      //Mensaje esperado
      const expectedResult = "User verified successfully";
      
      //Simulamos que el servicio se ejecuto correctamente.
      mockService.verifyUser.mockResolvedValue(expectedResult);

      //Testeamos el metodo y guardamos el resultado de la ejecucuión.
      const res = await mockService.verifyUser(id);

      //Testeamos que si se haya llamado al metodo con el id.
      expect(mockService.verifyUser).toHaveBeenCalledWith(id);
    
      //Testeamos que el mensaje devuelto si sea el esperado.
      expect(res).toBe(expectedResult);
    })
  })

  describe("findInfo()",()=>{

    //Creamos un id para las pruebas.
    const id = "userId";

    it("Debería llamar al metodo con los datos del id y retornar un arreglo con los datos del usuario", async ()=>{
      
      //Mensaje esperado
      const expectedResult = [
        {
          firstValue:"firstValue"
        }
      ];
      
      //Simulamos que el servicio se ejecuto correctamente.
      mockService.findInfo.mockResolvedValue(expectedResult);

      //Testeamos el metodo y guardamos el resultado de la ejecucuión.
      const res = await mockService.findInfo(id);

      //Testeamos que si se haya llamado al metodo con el id.
      expect(mockService.findInfo).toHaveBeenCalledWith(id);
    
      //Testeamos que el mensaje devuelto si sea el esperado.
      expect(res).toBeDefined;
    })

    it("Debería tener el decorador UseGuards con el guard: SellerUsersGuard",()=>{
      
      //Creamos una instancia de la calse Reflector
      const reflector = new Reflector();

      //Obtenemos los guards que se estan usando en el metodo.
      const guards = Reflect.getMetadata('__guards__',controller.changePassword);

      //Verificamos si el guard SellerUsersGuard esta entre los utilizados.
      const usesSellerUsersGuard = guards?.some((e) => e.name === SellerUsersGuard.name);

      //Testeamos si se usa el guard.
      expect(usesSellerUsersGuard).toBe(true);

    })
  })

  describe("update()",()=>{

    //Creamos un id para las pruebas.
    const id = "userId";

    //Creamos un updateSellerUserDto para las pruebas.
    const updateSellerUserDto = {
    
      company_name:"Prueba 3",
      address:"Prueb",
      user_password:"Prueba3",
      email:"prueba@gmail.com",
      cellphone_number:"0000000000",
      user_image: "/xstremiscx_user_image.png",
      user_type:1

    }

    it("Debería llamar al metodo con los datos del id, el updateSellerDto y retornar un mensaje de exito", async ()=>{
      
      //Mensaje esperado
      const expectedResult = "User updated successfully"
      
      //Simulamos que el servicio se ejecuto correctamente.
      mockService.update.mockResolvedValue(expectedResult);

      //Testeamos el metodo y guardamos el resultado de la ejecucuión.
      const res = await mockService.update(id,updateSellerUserDto);

      //Testeamos que si se haya llamado al metodo con el id.
      expect(mockService.update).toHaveBeenCalledWith(id,updateSellerUserDto);
    
      //Testeamos que el mensaje devuelto si sea el esperado.
      expect(res).toBe(expectedResult);
    })

    it("Debería tener el decorador UseGuards con el guard: SellerUsersGuard",()=>{
      
      //Creamos una instancia de la calse Reflector
      const reflector = new Reflector();

      //Obtenemos los guards que se estan usando en el metodo.
      const guards = Reflect.getMetadata('__guards__',controller.changePassword);

      //Verificamos si el guard SellerUsersGuard esta entre los utilizados.
      const usesSellerUsersGuard = guards?.some((e) => e.name === SellerUsersGuard.name);

      //Testeamos si se usa el guard.
      expect(usesSellerUsersGuard).toBe(true);

    })
  })

  describe("remove()",()=>{

    //Creamos un id para las pruebas.
    const id = "userId";

    it("Debería llamar al metodo con los datos del id y retornar un mensaje de exito", async ()=>{
      
      //Mensaje esperado
      const expectedResult = "User removed successfully"
      
      //Simulamos que el servicio se ejecuto correctamente.
      mockService.remove.mockResolvedValue(expectedResult);

      //Testeamos el metodo y guardamos el resultado de la ejecucuión.
      const res = await mockService.remove(id);

      //Testeamos que si se haya llamado al metodo con el id.
      expect(mockService.remove).toHaveBeenCalledWith(id);
    
      //Testeamos que el mensaje devuelto si sea el esperado.
      expect(res).toBe(expectedResult);
    })

    it("Debería tener el decorador UseGuards con el guard: SellerUsersGuard",()=>{
      
      //Creamos una instancia de la calse Reflector
      const reflector = new Reflector();

      //Obtenemos los guards que se estan usando en el metodo.
      const guards = Reflect.getMetadata('__guards__',controller.changePassword);

      //Verificamos si el guard SellerUsersGuard esta entre los utilizados.
      const usesSellerUsersGuard = guards?.some((e) => e.name === SellerUsersGuard.name);

      //Testeamos si se usa el guard.
      expect(usesSellerUsersGuard).toBe(true);

    })
  })

  describe("login()",()=>{

    //Creamos un id para las pruebas.
    const loginSellerDto = {
      email:"prueba2@gmail.com",
      password:"Prueba Prueba 1"
    };

    it("Debería llamar al metodo con los datos del login y retornar un access_token", async ()=>{
      
      //Mensaje esperado
      const expectedResult = { accessToken:"accessToken"};
      
      //Simulamos que el servicio se ejecuto correctamente.
      mockService.login.mockResolvedValue(expectedResult);

      //Testeamos el metodo y guardamos el resultado de la ejecucuión.
      const res = await mockService.login(loginSellerDto);

      //Testeamos que si se haya llamado al metodo con el id.
      expect(mockService.login).toHaveBeenCalledWith(loginSellerDto);
    
      //Testeamos que el mensaje devuelto si sea el esperado.
      expect(res).toEqual(expectedResult);
    })
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

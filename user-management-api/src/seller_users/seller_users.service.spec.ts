//Mockeamos el bcrypt para poder simular sus resultados mas adelante
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  compareSync: jest.fn(),
  genSaltSync: jest.fn().mockReturnValue('fake-salt'),
  hashSync: jest.fn().mockImplementation((pass, salt) => `hashed-${pass}`)
}));


import { Test, TestingModule } from '@nestjs/testing';
import { SellerUsersService } from './seller_users.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('SellerUsersService', () => {
  let service: SellerUsersService;
  const mockDb = {query: jest.fn()};
  const mockJwt = {
    signAsync: jest.fn().mockResolvedValue("fake-token"),
    verify: jest.fn()
  }
  const mockBcrypt = {
    compareSync: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerUsersService,
        {
         provide: DatabaseService,
          useValue: mockDb
        },
        {
          provide: JwtService,
          useValue: mockJwt
        }
      ]
    }).compile();

    service = module.get<SellerUsersService>(SellerUsersService);
  });

  //Testing de el metodo create
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

    it("Debería crear un usuario nuevo exitosamente y regresar el mensaje: User created successfully",async ()=>{
      
      //Hacemos que el metodo para verificar que el usuario no existe devuelva true.
      jest.spyOn(service, "checkIfUserExists").mockResolvedValue(false);
      
      //Hacemos que el metodo para verificar que se envio el correo devuelva true.
      jest.spyOn(service, "sendVerificationMail").mockResolvedValue(true);

      //Se simula la ejecución del llamado a la base de datos.
      mockDb.query.mockResolvedValue([]);

      //Testeamos el metodo de crear usuarios y guardamos el resultado para verificarlo mas tarde.
      const res =  await service.create(createSellerUserDto);

      //Verificamos que el mensaje devuelto si coincida con el esperado.
      expect(res).toEqual("User created successfully");

      //Verificamos que si se haya llamado al databaseService.query con la consulta y los parametros.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO seller_users"),
        expect.any(Array)
      );
    })

    it("Debería mandar un error en caso de que el correo del usuario ya este registrado.", async ()=>{

      //Simulamos que se detecto que el correo del usuario ya esta registrado
      jest.spyOn(service, "checkIfUserExists").mockResolvedValue(true);

      //Esperamos que se lance un error con el mensaje correspondiente
      await expect(service.create(createSellerUserDto))
        .rejects
        .toThrow(`User email ${createSellerUserDto.email} already exists`)
    })
    
    it("Debería mandar una excepción http en caso de ocurrir un error durante el proceso de creación del usuario", async ()=>{

      //Creamos un mensaje de error de prueba.
      const errorMessage = "No es posible conectarse a la base de datos";

      //Simulamos que ocurre un error durante la comprobación de si existe un usuario.
      jest.spyOn(service, "checkIfUserExists").mockRejectedValue(new Error(errorMessage));

      //Ejecutamos el metodo y esperamos que tire un HttpException.
      await expect(service.create(createSellerUserDto))
        .rejects
        .toThrow(`Error creating seller user: ${errorMessage}`)
    })

    it("Debería mandar un error en caso de que algo falle en el proceso de enviar el correo de verificación", async ()=>{

      //Creamos un mensaje de error de prueba.
      const errorMessage = "No se ha encontrado la dirección de correo especificada";

      //Simulamos que el metodo para enviar el correo tiene un error.
      jest.spyOn(service, "sendVerificationMail").mockRejectedValue(new Error(errorMessage));

      //Ejecutamos el metodo esperando a que mande un error al fallar el envio de la verificación del email.
      await expect(service.create(createSellerUserDto))
        .rejects
        .toThrow(`Error creating seller user: ${errorMessage}`)
    })
  })

  describe("changePassword()", ()=>{
    
    //Creamos los parametros que recibiria el metodo y les asignamos datos de prueba.
    const id = "userId";
    const newPassword = JSON.parse('{"new_password":"newPassword"}');
    
    it("Debería cambiar la contraseña satisfactoriamente y regresar el mensaje: User password changed successfully", async ()=>{

      //Simulamos la ejecución del query a la base de datos.
      mockDb.query.mockResolvedValue([]);

      //Guardamos el resultado de la ejecución del metodo a testear.
      const res = await service.changePassword(id,newPassword);

      //Verificamos que el mensaje de exito sea igual al esperado.
      expect(res).toEqual("User password changed successfully")

      //Verificamos que se haya llamado a la base de datos correctamente.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE seller_users SET user_password"),
        expect.any(Array)
      )
    })

    it("Debería mandar un mensaje de error en caso de que ocurra algun problema durante la ejecución.",async ()=>{

      //Creamos un mensaje de error de prueba.
      const errorMessage = "No se ha podido ejecutar el cambio de contraseña"

      //Simulamos un error durante la ejecución del llamado a la base de datos.
      mockDb.query.mockImplementation(()=>{
        throw new Error(errorMessage)
      })

      //Simulamos que ocurre un error duarante la ejecución.
      expect(() => service.changePassword(id,newPassword)).toThrow(`Error changing password for seller user: ${errorMessage}`)
    })

  })

  describe("verifyUser()",()=>{
    
    //Creamos un parametro id de prueba.
    const id = "idUser";

    it("Debería verificar satisfactoriamente un usuario y devolver el mensaje: User verified successfully", async ()=>{

      //Simulamos el llamado a la base de datos.
      mockDb.query.mockResolvedValue([]);

      //Testeamos el metodo esperando y almacenamos la respuesta.
      const res = await service.verifyUser(id);

      //Verificamos que el mensaje recibido sea el esperado.
      expect(res).toEqual("User verified successfully")

      //Verificamos que el llamado a la base de datos sea haya hecho correctamente.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE seller_users SET verified"),
        expect.any(Array)
      )
    })

    it("Debería enviar un error en caso de ocurrir algun problema durante la ejecución",()=>{

      //Creamos un mensaje de error de prueba.
      const errorMessage = "Error al verificar el usuario";

      //Simulamos un error durante la llamada a la base de datos.
      mockDb.query.mockImplementation(()=>{
        throw new Error(errorMessage);
      })

      //Ejecutamos el metodo y testeamos si manda el mensaje de error.
      expect(()=>service.verifyUser(id)).toThrow(`Error verifying seller user: ${errorMessage}`)
    })

  })

  describe("findInfo()",()=>{

    const id = "userId";

    it("Debería retornar los datos del usuario satisfactoriamente",async ()=>{

      //Simulamos la ejecución de la llamada a la base de datos y retornamos datos de prueba.
      mockDb.query.mockResolvedValue({'name':'prueba'});

      //Testeamos el resultado de la ejecución y lo almacenamos para verificar que si se haya devuelto algo.
      const res = await service.findInfo(id);

      //Testeamos que si se devuelva algo.
      expect(res).toBeDefined();
      expect(res).not.toBeNull();

      //Verificamos que el llamado a la base de datos si se haya hecho correctamente con el query y parametro.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT"),
        expect.any(Array)
      )
    })

    it("Debería mandar un error en caso de no encontrar al usuario ni obtener sus datos.",async ()=>{

      //Simulamos que la llamada a la base de datos no pudo encontrar ningun usuario con ese id.
      mockDb.query.mockResolvedValue(undefined);

      //Testeamos que el código mande un mensaje de error al no encontrar el usuario.
      await expect(service.findInfo(id)).rejects.toThrow(`Error finding seller user: Seller user with id ${id} not found`);
    })

    it("Debería mandar un error en caso de algún problema durante la ejecución del código",async ()=>{

      //Creamos un mensaje de error de preuba
      const errorMessage = "Error al conectar con la base de datos";

      //Hacemos que en la llamada a la base de datos ocurra un error.
      mockDb.query.mockImplementation(()=>{
        throw new Error(errorMessage);
      })

      //Ejecutamos el metodo y esperamos que devuelva un error.
      await expect(service.findInfo(id)).rejects.toThrow(`Error finding seller user: ${errorMessage}`);
    })
  })

  describe("update()",()=>{

    //Creamos un updateSellerUserDto para el test
    const updateSellerUserDto = {
        
      company_name:"Prueba 3",
      address:"Prueb",
      user_password:"Prueba3",
      email:"prueba@gmail.com",
      cellphone_number:"0000000000",
      user_image: "/xstremiscx_user_image.png",
      user_type:1

    }

    //Creamos un id de prueba
    const id = "userid";

    it("Debería actualizar correctamente los datos del usuario y devolver el mensaje: User updated successfully",()=>{

      //Simulamos la llamada a la base de datos.
      mockDb.query.mockResolvedValue([]);

      //Testeamos el metodo y almacenamos el resultado devuelto.
      const res = service.update(id,updateSellerUserDto);

      //Verificamos que el resultado devuelto sea el esperado.
      expect(res).toEqual("User updated successfully");

      //Verificamos que la llamada a la base de datos sea correcta y se haya hecho con los parametros adecuados.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE seller_users SET"),
        expect.any(Array)
      )
    })

    it("Debería enviar un error en caso de un problema con la ejecución del código",()=>{

      //Creamos un mensaje de error.
      const errorMessage = "Error, la base de datos esta dañada"

      //Hacemos que la llamada a la base de datos genere un error.
      mockDb.query.mockImplementation(() =>{
          throw new Error(errorMessage);
        }
      )

      //Verificamos que el metodo si detecte el error y lo mande.
      expect(()=>service.update(id,updateSellerUserDto)).toThrow(`Error updating seller user: ${errorMessage}`)
    })

  })

  describe("remove()",()=>{

    //Creamos un id de prueba
    const id = "userid";

    it("Debería eliminar correctamente los datos del usuario y devolver el mensaje: User removed successfully",()=>{

      //Simulamos la llamada a la base de datos.
      mockDb.query.mockResolvedValue([]);

      //Testeamos el metodo y almacenamos el resultado devuelto.
      const res = service.remove(id);

      //Verificamos que el resultado devuelto sea el esperado.
      expect(res).toEqual("User removed successfully");

      //Verificamos que la llamada a la base de datos sea correcta y se haya hecho con los parametros adecuados.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM seller_users"),
        expect.any(Array)
      )
    })

    it("Debería enviar un error en caso de un problema con la ejecución del código",()=>{

      //Creamos un mensaje de error.
      const errorMessage = "Error, la base de datos esta dañada"

      //Hacemos que la llamada a la base de datos genere un error.
      mockDb.query.mockImplementation(() =>{
          throw new Error(errorMessage);
        }
      )

      //Verificamos que el metodo si detecte el error y lo mande.
      expect(()=>service.remove(id)).toThrow(`Error removing seller user: ${errorMessage}`)
    })

  })

  describe("login",()=>{

    // Creamos un loginData de prueba.
    const loginData = {
      "email":"prueba2@gmail.com",
      "password":"Prueba Prueba 1"
    }

    it("Debería iniciar sesión correctamente y devoler un token",async ()=>{

      //Simulamos la ejecución de la llamada a la base de datos.
      mockDb.query.mockResolvedValue([{
        seller_id:"userId", verified:true, user_password:"hashed-Prueba Prueba 1"
      }]);

      //Hacemos que la verificación de la contraseña correcta sea true.
      jest.spyOn(bcrypt, "compareSync").mockReturnValue(true);

      //Testeamos el metodo y almacenamos lo que retorna para verificarlo mas adelante.
      const res = await service.login(loginData);

      //Verificamos que el resultado sea el esperado.
      expect(res).toEqual({accessToken:"fake-token"});

      //Verificamos que la llamada a la base de datos sea correcta y tenga los parametros esperados.
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT seller_id, verified, user_password FROM seller_users"),
        expect.any(Array)
      )

      //Verificamos que si se este entragando correctamente el id del usuario a la generación del token.
      expect(mockJwt.signAsync).toHaveBeenCalledWith({seller_id:"userId"})
    })

    it("Debería de devolver un HttpExpetion con status 401 cuando la contraseña no es correcta.",async ()=>{
      
      //Simulamos la ejecución de la llamada a la base de datos.
      mockDb.query.mockResolvedValue([{
        seller_id:"userId", verified:true, user_password:"hashed-Prueba Prueba 1"
      }]);

      //Hacemos que la verificación de la contraseña correcta sea true.
      jest.spyOn(bcrypt, "compareSync").mockReturnValue(false);

      //Ejecutamos el metodo y esperamos que tire un error al detectar que no es la contraseña correcta.
      await expect(service.login(loginData)).rejects.toThrow(expect.objectContaining({
        message:'Invalid user or password',
        status: 401
      }));

    })

    it("Debería de devolver un HttpExpetion con status 401 cuando el usuario no esta verificado",async ()=>{
      
      //Simulamos la ejecución de la llamada a la base de datos devolviendo que el usuario no esta verificado.
      mockDb.query.mockResolvedValue([{
        seller_id:"userId", verified:false, user_password:"hashed-Prueba Prueba 1"
      }]);

      //Ejecutamos el metodo y esperamos que tire un error al detectar que no esta verificado el usuario.
      await expect(service.login(loginData)).rejects.toThrow(expect.objectContaining({
        message:'User not verified',
        status: 401
      }));

    })

    it("Debería de devolver un HttpExpetion con status 404 cuando el usuario no se encuentra en la base de datos",async ()=>{
      
      //Simulamos la ejecución de la llamada a la base de datos sin que devuelva ningun resultado.
      mockDb.query.mockResolvedValue([]);

      //Ejecutamos el metodo y esperamos que tire un error al detectar que no se a encontrado el usuario.
      await expect(service.login(loginData)).rejects.toThrow(expect.objectContaining({
        message:'User not found',
        status: 404
      }));

    })

    it("Debería devolver un error encaso de que ocurra algun problema durante la ejecución del código",async ()=>{

      //Creamos un mensaje de error de prueba.
      const erroMessage = "La base de datos no se encuentra.";

      //Simulamos un error con la llamada a la base de datos.
      mockDb.query.mockImplementation(()=>{
        throw new Error(erroMessage);
      })

      //Testeamos si el metodo detecta el error y lo lanza.
      await expect(service.login(loginData)).rejects.toThrow(erroMessage);
    })

  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
